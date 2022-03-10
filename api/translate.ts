import { ButtonInteraction, CommandInteraction, User } from "discord.js";
import { tournamentErrorType, updateType } from "../types/enums.js";

export class Translate {
    /**
     * Translates Riot API objects into summonerDB object.
     * @param summoner Riot API summonerItem.
     * @param league Riot API leagueItem.
     * @returns summonerDB object defined by Riot API objects.
     */
    static riotToSummonerDB(summoner: summonerItem | summonerDB, league: leagueItem): summonerDB {
        let summonerName = ('name' in summoner) ? summoner.name : summoner.summonerName;
        let item: summonerDB = {
            accountId: summoner.accountId,
            summonerName: summonerName,
            id: summoner.id,
            puuid: summoner.puuid,
            queueType: "RANKED_TFT",
            tier: "UNRANKED",
            rank: "I",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
        };
        if (!league) return item;
        if (league.summonerName) item.summonerName = league.summonerName;
        if (league.queueType) item.queueType = league.queueType;
        if (league.tier) item.tier = league.tier;
        if (league.rank) item.rank = league.rank;
        if (league.leaguePoints) item.leaguePoints = league.leaguePoints;
        if (league.wins) item.wins = league.wins;
        if (league.losses) item.losses = league.losses;
        return item;
    }

    /**
     * Translates Riot tier, rank, and leaguePoints into one human-readable string.
     * @param summonerInDatabase summonerDB to translate.
     * @param lp Include leaguePoints in string or not.
     * @returns Human-readable string for rank.
     */
    static readableRank(summonerInDatabase: summonerDB, lp: boolean): string {
        const lowercaseTier = summonerInDatabase.tier.toLowerCase();
        const tier = summonerInDatabase.tier[0] + lowercaseTier.slice(1);
        let rank = tier;
        
        if (!(tier === 'Unranked' || tier === 'Master' || tier === 'Grandmaster' || tier === 'Challenger')) {
            rank += ` ${summonerInDatabase.rank}`;
        }
        if (lp && tier !== 'Unranked') {
            rank += ` ${summonerInDatabase.leaguePoints} LP`;
        }
        return rank;
    }

    /**
     * Translates one updateExpression into an updateExpressionArray with its condition and insert condition.
     * @param type Type of update.
     * @param variable Variable to update.
     * @param value New value to update to.
     * @param condType If condition is required, equals updateType.COND.
     * @param condValue Old value of variable to compare to.
     * @param insert True if insert on id not found, False if no insert.
     * @returns Array of update expressions corresponding to the variable.
     */
    static updateExpressionsToUpdateExpressionArray(
        type: number,
        variable: string,
        value: any,
        condType: number,
        condValue: any,
        insert: boolean
    ): updateExpression[] {
        let updateExpressionArray: updateExpression[] = [];
        const expression: updateExpression = {
            type: type,
            variable: variable,
            value: value
        };
        updateExpressionArray.push(expression);
        // if condition exists
        if (condType === updateType.COND) {
            const condition: updateExpression = {
                type: updateType.COND,
                variable: variable,
                value: condValue
            };
            updateExpressionArray.push(condition);
        }
        // if no insert
        if (!insert) {
            const noInsertCondition: updateExpression = { type: updateType.NO_INSERT };
            updateExpressionArray.push(noInsertCondition);
        }
        return updateExpressionArray;
    }

    /**
     * Translates a list of updateExpressions into the DocumentClient update format.
     * @param updateExpressionArray List of updateExpressions for one object.
     * @returns updateFormat containing updateExpression, expressionAttributeNames, and expressionAttributeValues.
     */
    static updateExpressionArrayToUpdateFormat(updateExpressionArray: updateExpression[]): updateFormat {
        let updateExpression: string = '';
        let expressionAttributeNames = {};
        let expressionAttributeValues = {};
        let conditionalExpression: string = '';
        for (let i = 0; i < updateExpressionArray.length; i++) {
            const currExpression = updateExpressionArray[i];
            if (currExpression.type === updateType.NO_INSERT) {
                if (conditionalExpression.length > 0) conditionalExpression += `AND `;
                conditionalExpression += `attribute_exists(id) `;
            } else if (currExpression.type === updateType.COND) {
                let condition: string = `${currExpression.variable} = :${currExpression.variable}${i} `;
                if (conditionalExpression.length > 0) condition = `AND ` + condition;
                conditionalExpression += condition;
                expressionAttributeValues[`:${currExpression.variable}${i}`] = currExpression.value; // override with array
            } else if (currExpression.type === updateType.SET) {
                updateExpression += `SET ${currExpression.variable} = :${currExpression.variable}${i} `;
                expressionAttributeValues[`:${currExpression.variable}${i}`] = currExpression.value; // override with array
            } else if (currExpression.type === updateType.ADDLIST) {
                updateExpression += `SET ${currExpression.variable} = list_append(${currExpression.variable}, :${currExpression.variable}${i}) `;
                expressionAttributeValues[`:${currExpression.variable}${i}`] = [currExpression.value]; // override with array
            } else if (currExpression.type === updateType.ADDMAP) { // remember dot between property and key
                updateExpression += `SET ${currExpression.variable} = :${currExpression.variable}${i}`;
                expressionAttributeValues[`:${currExpression.variable}${i}`] = currExpression.value; // override with array
            } else if (currExpression.type === updateType.REMOVELIST) {
                updateExpression +=  `REMOVE ${currExpression.variable}[${currExpression.value}] `;
            }
        }

        let retObject: updateFormat = {
            updateExpression,
            expressionAttributeNames,
            expressionAttributeValues,
            conditionalExpression
        }
        return retObject;
    }

    /**
     * Translates the responses from batchGet to an array of objects from the database.
     * @param responses Responses from batchGet.
     * @param table Table items to extract from responses.
     * @returns Array of objects in responses corresponding to the table.
     */
    static batchGetResponsesToOneDBObject(responses: Object, table: string): any {
        if (!responses.hasOwnProperty(table)) return null;
        let dbObjectArray: any = [];
        for (const obj of responses[table]) {
            dbObjectArray.push(obj);
        }
        return dbObjectArray;
    }

    /**
     * Translates an error message to a interaction reply.
     * @param err Error thrown.
     * @param name Tournament id.
     * @param user User the command is for.
     * @param interaction Discord.js CommandInteraction of command.
     * @param defaultMessage Default message for non-specified errors.
     */
    static async tournamentErrorTypeToInteractionReply(
        err: Error,
        name: string, 
        user: User, 
        interaction: CommandInteraction | ButtonInteraction, 
        defaultMessage: string
    ): Promise<void> {
        console.log(err.message);
        try {
            switch (err.message) {
                case tournamentErrorType.DUPLICATE_TOURNAMENT:
                    await await interaction.reply(`Duplicate ID error: Tournament with ID **${name}** already exists. Please choose a different name.`); break;
                case tournamentErrorType.UPDATE_COND_FAIL:
                    await interaction.reply(`The service for tournament **${name}** is overwhelmed right now. Please try again in a couple seconds.`); break;
                case tournamentErrorType.NO_TOURNAMENT:
                    await interaction.reply(`There is no tournament with id **${name}**. Please check the name again (case-sensitive).`); break;
                case tournamentErrorType.NO_SUMMONER_NAME:
                    await interaction.reply(`has not set a summoner name. Please set a summoner name with \`user set <summoner_name>\`.`);
                    await interaction.editReply(`<@${user.id}> has not set a summoner name. Please set a summoner name with \`user set <summoner_name>\`.`); break;
                case tournamentErrorType.ALREADY_REGISTERED:
                    await interaction.reply(`is already registered for tournament **${name}**.`);
                    await interaction.editReply(`<@${user.id}> is already registered for tournament **${name}**.`); break;
                case tournamentErrorType.NOT_REGISTERED:
                    await interaction.reply(`is already not registered for tournament **${name}**.`);
                    await interaction.editReply(`<@${user.id}> is already not registered for tournament **${name}**.`); break;
                case tournamentErrorType.ALREADY_ADMIN:
                    await interaction.reply(`is already an admin for tournament **${name}**.`);
                    await interaction.editReply(`<@${user.id}> is already an admin for tournament **${name}**.`); break;
                case tournamentErrorType.NOT_ADMIN:
                    await interaction.reply(`is already not an admin for tournament **${name}**.`);
                    await interaction.editReply(`<@${user.id}> is already not an admin for tournament **${name}**.`); break;
                case tournamentErrorType.NO_ADMIN_PERMISSION:
                    await interaction.reply(`You do not have permission to run this command (must be an admin).`); break;
                case tournamentErrorType.COLLECTOR_TIMEOUT:
                    await interaction.reply({ content: `The command has timed out.`, components: [] }); break;
                default:
                    await interaction.reply(defaultMessage);
            }
        } catch (newErr: Error | any) {
            if (newErr.name === `[INTERACTION_ALREADY_REPLIED]`) {
                switch (err.message) {
                    case tournamentErrorType.DUPLICATE_TOURNAMENT:
                        await await interaction.editReply(`Duplicate ID error: Tournament with ID **${name}** already exists. Please choose a different name.`); break;
                    case tournamentErrorType.UPDATE_COND_FAIL:
                        await interaction.editReply(`The service for tournament **${name}** is overwhelmed right now. Please try again in a couple seconds.`); break;
                    case tournamentErrorType.NO_TOURNAMENT:
                        await interaction.editReply(`There is no tournament with id **${name}**. Please check the name again (case-sensitive).`); break;
                    case tournamentErrorType.NO_SUMMONER_NAME:
                        await interaction.editReply(`<@${user.id}> has not set a summoner name. Please set a summoner name with \`user set <summoner_name>\`.`); break;
                    case tournamentErrorType.ALREADY_REGISTERED:
                        await interaction.editReply(`<@${user.id}> is already registered for tournament **${name}**.`); break;
                    case tournamentErrorType.NOT_REGISTERED:
                        await interaction.editReply(`<@${user.id}> is already not registered for tournament **${name}**.`); break;
                    case tournamentErrorType.ALREADY_ADMIN:
                        await interaction.editReply(`<@${user.id}> is already an admin for tournament **${name}**.`); break;
                    case tournamentErrorType.NOT_ADMIN:
                        await interaction.editReply(`<@${user.id}> is already not an admin for tournament **${name}**.`); break;
                    case tournamentErrorType.NO_ADMIN_PERMISSION:
                        await interaction.editReply(`You do not have permission to run this command (must be an admin).`); break;
                    case tournamentErrorType.COLLECTOR_TIMEOUT:
                        await interaction.editReply({ content: `The command has timed out.`, components: [] }); break;
                    default:
                        await interaction.editReply(defaultMessage);
                }
            } else {
                console.log(`Error in translate tournamentErrorTypeToInteractionReply: ${newErr}`);
            }
        }
    }
}