import { Client, CommandInteraction } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash, SlashGroup, SlashOption } from "discordx";
import { RiotAPI } from "../api/riot.js";

@Discord()
@SlashGroup("user", "Edit user information")
export class User {
    @Slash("set")
    async set(
        @SlashOption("summoner", { description: "Your TFT summoner name."})
        summoner: string,
        interaction: CommandInteraction
        ) {
        await interaction.reply(`Yooooooo your summoner is now ${summoner}!`);
    }

    @Slash("rank")
    async rank(
        @SlashOption("summoner", {description: "Your TFT summoner"})
        summoner: string,
        interaction: CommandInteraction
    ) {
        const summonerInfo = await RiotAPI.fetchSummoner(summoner);
        const leagueInfo = await RiotAPI.fetchLeague(summonerInfo.id);
        await interaction.reply(`its lit i got ${leagueInfo.summonerName} is ${leagueInfo.tier}!`);
    }
    

    @SimpleCommand("bing")
    async bing(command: SimpleCommandMessage) {
        command.message.reply("hello");
    }
}