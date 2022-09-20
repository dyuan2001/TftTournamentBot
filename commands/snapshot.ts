import { CommandInteraction, User } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup("snapshot", "Snapshot configuration, registration, and more.")
export class SnapshotCommands {
    /*
    List of commands:
        snapshot create
        snapshot delete
        snapshot register
        snapshot unregister
        snapshot leaderboard
        snapshot schedule
        snapshot cancel
    */

    @Slash("create", { description: "Create a snapshot leaderboard." })
    create(
        @SlashOption("name", { description: "Snapshot leaderboard name. Must be unique." })
        name: string,
        @SlashOption("description", { description: "Snapshot description. Can be set later." })
        description: string,
        interaction: CommandInteraction
    ) {
        const user: User = interaction.user;
        console.log(`\nCreating snapshot with id ${name} and admin ${user.username}...`);
        try {
            
        } catch (err) {
            console.log(`Error in snapshot create: ${err}`);

        }
    }

    delete() {

    }
}