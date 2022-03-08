import { Helper } from "../api/helper.js";
import { CommandInteraction, User } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { DatabaseAPI } from "../api/db.js";
import { tournamentErrorType, updateType } from "../types/enums.js";
import { Translate } from "../api/translate.js";

@Discord()
@SlashGroup("tournament", "Tournament creation, registration, and other commands.")
export class TournamentCommands {
    @Slash("create", { description: "Create a tournament."} )
    async create(
        @SlashOption("name", { description: "Tournament name (must be unique)."})
        name: string,
        @SlashOption("description", { description: "Tournament description. Can be set later.", required: false })
        description: string,
        @SlashOption("admin", { description: "Add a secondary admin besides you. Can set more later.", required: false })
        admin: User,
        interaction: CommandInteraction
    ) {
        if (!description) description = '';
        console.log(`COMMAND: Creating tournament with id ${name} and admin ${interaction.user.username}...`);
        try {
            let admins = [interaction.user.id];
            if (admin) admins.push(admin.id);

            await Helper.putTournamentIfAvailableOrExpired({
                id: name,
                description: description,
                timeCreated: Date.now(),
                admins: admins,
                participants: [],
                participantMap: new Map<string, participantInfo>(),
                lobbies: new Map<string, lobbyInfo>()
            });
            await interaction.reply(`Tournament **${name}** has been successfully created!`);
        } catch (err) {
            console.log(`Error in tournament create: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                interaction.user,
                interaction,
                `There was an error creating this tournament. Please try again later.`
            );
        }
    }

    @Slash("setdescription", { description: "Set tournament description. Only usable by admins." })
    async setDescription(
        @SlashOption("name", { description: "Tournament name." })
        name: string,
        @SlashOption("description", { description: "New tournament description. This will overwrite the current description." })
        description: string,
        interaction: CommandInteraction
    ) {
        console.log(`COMMAND: Setting description of tournament ${name}...`);
        try {
            await Helper.checkAdmin(interaction.user, null, name);
            const setDescriptionExpression: updateExpression = {
                type: updateType.SET,
                variable: `description`,
                value: description
            };
            const updateExpressionArray = [setDescriptionExpression];
            await DatabaseAPI.updateTournament(name, updateExpressionArray);
            await interaction.reply(`Tournament **${name}**'s description has been successfully set to *${description}*!`);
        } catch (err) {
            console.log(`Error in tournament setdescription: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                interaction.user,
                interaction,
                `There was an error creating this tournament. Please try again later.`
            );
        }
    }

    @Slash("register", { description: "Register for a tournament." } )
    async register(
        @SlashOption("name", { description: "Tournament name."} )
        name: string,
        @SlashOption("user", { description: "User to register. Only usable by admins.", required: false })
        user: User,
        interaction: CommandInteraction
    ) {
        if (!user) user = interaction.user;
        console.log(`COMMAND: Registering ${user.username} for tournament ${name}...`);
        try {
            const tournamentInfo: tournamentDB = await DatabaseAPI.getTournament(name);
            if (!tournamentInfo) throw new Error(tournamentErrorType.NO_TOURNAMENT);

            if (user !== interaction.user) await Helper.checkAdmin(interaction.user, tournamentInfo, null);
            
            const userInfo = await DatabaseAPI.getUser(user.id);
            if (!userInfo) throw new Error(tournamentErrorType.NO_SUMMONER_NAME);

            const index: number = tournamentInfo.participants.indexOf(user.id);
            if (index >= 0) throw new Error(tournamentErrorType.ALREADY_REGISTERED);

            const registerExpression: updateExpression = {
                type: updateType.ADDLIST,
                variable: "participants",
                value: interaction.user.id
            };
            const updateExpressionArray = [registerExpression];
            await DatabaseAPI.updateTournament(name, updateExpressionArray);
            await interaction.reply(`You have successfully registered for tournament **${name}**!`);
        } catch (err) {
            console.log(`Error in tournament register: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                user,
                interaction,
                `There was an error registering for this tournament. Please try again later.`
            );
        }
    }

    @Slash("unregister", { description: "Unregister for a tournament."})
    async unregister(
        @SlashOption("name", { description: "Tournament name." })
        name: string,
        @SlashOption("user", { description: "User to unregister. Only usable by admins.", required: false })
        user: User,
        interaction: CommandInteraction
    ) {
        if (!user) user = interaction.user;
        console.log(`COMMAND: Unregistering ${user.username} for tournament ${name}...`);
        try {
            const tournamentInfo = await DatabaseAPI.getTournament(name);
            if (!tournamentInfo) throw new Error(tournamentErrorType.NO_TOURNAMENT);
            
            if (user !== interaction.user) await Helper.checkAdmin(interaction.user, tournamentInfo, null);

            const index: number = tournamentInfo.participants.indexOf(user.id);
            if (index < 0) throw new Error(tournamentErrorType.NOT_REGISTERED);

            const unregisterExpression: updateExpression = {
                type: updateType.REMOVELIST,
                variable: "participants",
                value: index.toString()
            };
            const updateExpressionArray = [unregisterExpression];
            await DatabaseAPI.updateTournament(name, updateExpressionArray);
            await interaction.reply(`has been successfully unregistered for tournament **${name}**.`);
            await interaction.editReply(`<@${user.id}> has been successfully unregistered for tournament **${name}**.`);
        } catch(err) {
            console.log(`Error in tournament unregister: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                user,
                interaction,
                `There was an error unregistering for this tournament. Please try again later.`
            );
        }
    }

    @Slash("addadmin", { description: "Add admin for a tournament."} )
    async addadmin(
        @SlashOption("name", { description: "Tournament name. Must be an admin of this tournament." })
        name: string,
        @SlashOption("user", { description: "User to make admin." })
        user: User,
        interaction: CommandInteraction
    ) {
        console.log(`COMMAND: Adding ${user.username} as admin to tournament ${name}...`);
    }

    async removeadmin() {

    }
}