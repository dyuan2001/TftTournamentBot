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
    async create(
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

    @Slash("schedule", { description: "Schedule a snapshot. Only usable by admins." })
    async schedule(
        @SlashOption("name", { description: "Snapshot leaderboard name." })
        name: string,
        @SlashOption("interval", { description: "Interval between snapshots. See README for format." })
        interval: string,
        @SlashOption("startdate", { description: "Start date of snapshots. Must be format YYYY-MM-DDTHH:MM:SS+X0:00 where X is the timezone offset." })
        startdate: string,
        @SlashOption("enddate", { description: "End date of snapshots. Must be format YYYY-MM-DDTHH:MM:SS+X0:00 where X is the timezone offset." })
        enddate: string,
        interaction: CommandInteraction
    ) {
        const user: User = interaction.user

        console.log(`\nScheduling snapshot with id ${name} and admin ${user.username}`)
        try {
            const start: Date = new Date(startdate)
            const end: Date = new Date(enddate)

            
        } catch (err) {

        }
    }
}