import { Helper } from "../api/helper.js";
import { CommandInteraction, User } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

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
                lobbies: new Map<string, lobbyInfo[]>()
            });
            await interaction.reply(`${name} tournament has been successfully created!`);
        } catch (err) {
            console.log(`Error in tournament create: ${err}`);
            if (err === `iderror`) {
                await interaction.reply(`Duplicate ID error: Tournament with ID ${name} already exists.`);
            } else {
                await interaction.reply(`There was an error creating this tournament. Please try again later.`);
            }
        }
    }
}