import { CommandInteraction, User } from "discord.js";
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
     * Translates a list of updateExpressions into the DocumentClient update format.
     * @param updateExpressionArray List of updateExpressions for one object.
     * @returns updateFormat containing updateExpression, expressionAttributeNames, and expressionAttributeValues.
     */
    static updateExpressionArrayToUpdateFormat(updateExpressionArray: updateExpression[]): updateFormat {
        let updateExpression: string = '';
        let expressionAttributeNames = {};
        let expressionAttributeValues = {};
        for (let i = 0; i < updateExpressionArray.length; i++) {
            const currExpression = updateExpressionArray[i];
            if (currExpression.type === updateType.SET) {
                updateExpression += `SET ${currExpression.variable} = :${currExpression.variable}${i} `;
                expressionAttributeValues[`:${currExpression.variable}${i}`] = currExpression.value; // override with array
            } else if (currExpression.type === updateType.ADDLIST) {
                updateExpression += `SET ${currExpression.variable} = list_append(${currExpression.variable}, :${currExpression.variable}${i}) `;
                expressionAttributeValues[`:${currExpression.variable}${i}`] = [currExpression.value]; // override with array
            } else if (currExpression.type === updateType.ADDMAP) {
                updateExpression += `SET #${currExpression.variable}${i}.${currExpression.key} = :${currExpression.variable}${i}`;
            } else if (currExpression.type === updateType.REMOVELIST) {
                updateExpression +=  `REMOVE ${currExpression.variable}[${currExpression.value}] `;
            }
        }

        let retObject: updateFormat = {
            updateExpression,
            expressionAttributeNames,
            expressionAttributeValues
        }
        return retObject;
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
        interaction: CommandInteraction, 
        defaultMessage: string
    ): Promise<void> {
        switch (err.message) {
            case tournamentErrorType.DUPLICATE_TOURNAMENT:
                await await interaction.reply(`Duplicate ID error: Tournament with ID **${name}** already exists. Please choose a different name.`); break;
            case tournamentErrorType.UPDATE_CONDITION:
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
            case tournamentErrorType.NOT_ADMIN:
                await interaction.reply(`You do not have permission to run this command (must be an admin).`);
            default:
                await interaction.reply(defaultMessage);
        }
    }
}