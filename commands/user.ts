import { Client, CommandInteraction } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup("user", "Edit user information")
export class User {
    @Slash("add")
    async add(
        @SlashOption("summoner", { description: "Your TFT summoner name."})
        summoner: string,
        interaction: CommandInteraction
        ) {
        await interaction.reply(`Yooooooo your summoner is now ${summoner}!`);
    }

    @SimpleCommand("bing")
    async bing(command: SimpleCommandMessage) {
        command.message.reply("hello");
    }
}