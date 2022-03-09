import { Helper } from "../api/helper.js";
import { ButtonInteraction, CommandInteraction, Message, MessageActionRow, User } from "discord.js";
import { ButtonComponent, Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { DatabaseAPI } from "../api/db.js";
import { tournamentErrorType, updateType } from "../types/enums.js";
import { Translate } from "../api/translate.js";
import { Embed } from "../components/embed.js";
import { Button } from "../components/button.js";
import { client } from "../index.js";

@Discord()
@SlashGroup("tournament", "Tournament creation, registration, and other commands.")
export class TournamentCommands {
    @Slash("create", { description: "Create a tournament." })
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
        console.log(`\nCOMMAND: Creating tournament with id ${name} and admin ${interaction.user.username}...`);
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

    @Slash("delete", { description: "Delete a tournament. Only usable by admins." })
    async delete(
        @SlashOption("name", { description: "Tournament name." })
        name: string,
        interaction: CommandInteraction
    ) {
        console.log(`\nCOMMAND: Deleting tournament with id ${name}...`);
        try {
            await Helper.checkAdmin(interaction.user, null, name);
            await interaction.deferReply({ ephemeral: true });

            const deleteTournamentButton = Button.deleteTournamentButton(name);
            const cancelButton = Button.cancelButton();
            const row = new MessageActionRow().addComponents(deleteTournamentButton, cancelButton);
            
            interaction.editReply({
                content: `Are you sure you want to delete tournament **${name}**? ***This action cannot be undone.***`, 
                components: [row]
            });
            const message = await interaction.fetchReply() as Message;
            const buttonInteraction = await message.awaitMessageComponent({ componentType: 'BUTTON', time: 15000});
            if (buttonInteraction.customId === `cancel-btn`) {
                await interaction.editReply({
                    content: `The delete operation on tournament **${name}** has been successfully cancelled.`,
                    components: []
                });
            } else {
                await DatabaseAPI.deleteTournament(name);
                await interaction.editReply({
                    content: `💥💥💥 **BOOM!** 💥💥💥`,
                    components: []
                });
                await interaction.followUp(`Tournament **${name}** has been successfully deleted.`);
            }
        } catch (err) {
            console.log(`Error in tournament create: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                interaction.user,
                interaction,
                `There was an error deleting this tournament. Please try again later.`
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
        console.log(`\nCOMMAND: Setting description of tournament ${name}...`);
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
                `There was an error setting the description for this tournament. Please try again later.`
            );
        }
    }

    @Slash("info", { description: "Get the info of a tournament." })
    async info(
        @SlashOption("name", { description: "Tournament name." })
        name: string,
        @SlashOption("registration", { description: "Enables registration buttons.", required: false })
        registration: boolean,
        interaction: CommandInteraction
    ) {
        console.log(`\nCOMMAND: Getting info of tournament ${name}...`);
        try {
            const tournamentInfo = await DatabaseAPI.getTournament(name);
            if (!tournamentInfo) throw new Error(tournamentErrorType.NO_TOURNAMENT);

            const embed = Embed.tournamentInfoEmbed(tournamentInfo);
            if (registration) { // add buttons
                const registerButton = Button.registerButton(name);
                const unregisterButton = Button.unregisterButton(name);
                const row = new MessageActionRow().addComponents(registerButton, unregisterButton);
                await interaction.reply({ embeds: [embed], files:['./assets/esportsLogo.png'], components: [row] });
            } else {
                await interaction.reply({ embeds: [embed], files:['./assets/esportsLogo.png'] });
            }
        } catch (err) {
            console.log(`Error in tournament info: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                interaction.user,
                interaction,
                `There was an error getting the info of this tournament. Please try again later.`
            );
        }
    }

    @Slash("register", { description: "Register for a tournament." } )
    async register(
        @SlashOption("name", { description: "Tournament name."} )
        name: string,
        @SlashOption("user", { description: "User to register. Only usable by admins.", required: false })
        user: User,
        interaction: CommandInteraction | ButtonInteraction
    ) {
        if (!user) user = interaction.user;
        console.log(`\nCOMMAND: Registering ${user.username} for tournament ${name}...`);
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
                value: user.id
            };
            const updateExpressionArray = [registerExpression];
            await DatabaseAPI.updateTournament(name, updateExpressionArray);
            await interaction.reply(`has been successfully registered for tournament **${name}**!`);
            await interaction.editReply(`<@${user.id}> has been successfully registered for tournament **${name}**!`);
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
        interaction: CommandInteraction | ButtonInteraction
    ) {
        if (!user) user = interaction.user;
        console.log(`\nCOMMAND: Unregistering ${user.username} for tournament ${name}...`);
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

    @Slash("addadmin", { description: "Add admin for a tournament. Only usable by admins."} )
    async addadmin(
        @SlashOption("name", { description: "Tournament name." })
        name: string,
        @SlashOption("user", { description: "User to make admin." })
        user: User,
        interaction: CommandInteraction
    ) {
        console.log(`\nCOMMAND: Adding ${user.username} as admin to tournament ${name}...`);
        try {
            const tournamentInfo: tournamentDB = await DatabaseAPI.getTournament(name);
            if (!tournamentInfo) throw new Error(tournamentErrorType.NO_TOURNAMENT);

            await Helper.checkAdmin(interaction.user, tournamentInfo, null); // check for admin privilege

            const index: number = tournamentInfo.admins.indexOf(user.id);
            if (index >= 0) throw new Error(tournamentErrorType.ALREADY_ADMIN);

            const addAdminExpression: updateExpression = {
                type: updateType.ADDLIST,
                variable: "admins",
                value: user.id
            };
            const updateExpressionArray = [addAdminExpression];
            await DatabaseAPI.updateTournament(name, updateExpressionArray);
            await interaction.reply(`has been successfully added as an admin for tournament **${name}**!`);
            await interaction.editReply(`<@${user.id}> has been successfully added as an admin for tournament **${name}**!`);
        } catch (err) {
            console.log(`Error in tournament addadmin: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                user,
                interaction,
                `There was an error adding an admin for this tournament. Please try again later.`
            );
        }
    }

    @Slash("removeadmin", { description: "Remove admin for a tournament. Only usable by admins."} )
    async removeadmin(
        @SlashOption("name", { description: "Tournament name." })
        name: string,
        @SlashOption("user", { description: "User to remove admin." })
        user: User,
        interaction: CommandInteraction
    ) {
        console.log(`\nCOMMAND: Removing ${user.username} as an admin for tournament ${name}...`);
        try {
            const tournamentInfo = await DatabaseAPI.getTournament(name);
            if (!tournamentInfo) throw new Error(tournamentErrorType.NO_TOURNAMENT);
            
            await Helper.checkAdmin(interaction.user, tournamentInfo, null); // check for admin privilege

            const index: number = tournamentInfo.admins.indexOf(user.id);
            if (index < 0) throw new Error(tournamentErrorType.NOT_ADMIN);

            const removeAdminExpression: updateExpression = {
                type: updateType.REMOVELIST,
                variable: "admins",
                value: index.toString()
            };
            const updateExpressionArray = [removeAdminExpression];
            await DatabaseAPI.updateTournament(name, updateExpressionArray);
            await interaction.reply(`has been successfully removed as an admin for tournament **${name}**.`);
            await interaction.editReply(`<@${user.id}> has been successfully removed as an admin for tournament **${name}**.`);
        } catch(err) {
            console.log(`Error in tournament unregister: ${err}`);
            await Translate.tournamentErrorTypeToInteractionReply(
                err,
                name,
                user,
                interaction,
                `There was an error removing an admin for this tournament. Please try again later.`
            );
        }
    }

    @ButtonComponent(new RegExp('^register-btn-.+', 's'))
    registerUsingButton(interaction: ButtonInteraction) {
        console.log(`\nBUTTON: Register button with customId ${interaction.customId} clicked...`);
        const id = interaction.customId.slice(13);
        this.register(id, interaction.user, interaction);
    }

    @ButtonComponent(new RegExp('^unregister-btn-.+', 's'))
    unregisterUsingButton(interaction: ButtonInteraction) {
        console.log(`\nBUTTON: Unregister button with customId ${interaction.customId} clicked...`);
        const id = interaction.customId.slice(15);
        this.unregister(id, interaction.user, interaction);
    }
}