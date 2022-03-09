import { DatabaseAPI } from "../api/db.js";
import { Helper } from "../api/helper.js";
import { Client, CommandInteraction, User } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash, SlashGroup, SlashOption } from "discordx";
import { RiotAPI } from "../api/riot.js";
import { Translate } from "../api/translate.js";
import { Embed } from "../components/embed.js";

@Discord()
@SlashGroup("user", "Edit user information")
export class UserCommands {
    @Slash("set", { description: "Set your TFT summoner name."})
    async set(
        @SlashOption("summoner", { description: "Your TFT summoner name."})
        summoner: string,
        interaction: CommandInteraction
    ) {
        console.log(`COMMAND: Setting summoner ${summoner} for ${interaction.user.username}...`);
        try {
            const summonerInfo = await Helper.getSummonerFromName(summoner, true);
            await DatabaseAPI.putUser({
                id: interaction.user.id,
                avatar: interaction.user.avatar,
                username: interaction.user.username,
                summonerId: summonerInfo.id
            });
            await interaction.reply(`Your summoner has been successfully set to **${summonerInfo.summonerName}**!`);
        } catch (err) {
            console.log(`Error in user set: ${err}`);
            await interaction.reply(`There was an error setting your summoner. Please try again later.`);
        }
    }

    @Slash("refresh", { description: "Refresh a user's TFT summoner stats."})
    async refresh(
        @SlashOption("user", { 
            description: "User info to refresh. Leave blank to refresh your own.",
            type: "USER",
            required: false
        })
        user: User,
        interaction: CommandInteraction
    ) {
        if (!user) user = interaction.user;
        console.log(`COMMAND: Refreshing info for ${user.username}...`);
        try {
            const userInfo = await DatabaseAPI.getUser(user.id);
            if (!userInfo) {
                await interaction.reply(`There was an error refreshing 's info. This user has not set a summoner yet.`);
                await interaction.editReply(`There was an error refreshing <@${user.id}>'s info. This user has not set a summoner yet.`);
            } else {
                const leagueInfo = await RiotAPI.fetchLeague(userInfo.summonerId);
                const summonerInfo = await DatabaseAPI.getSummoner(userInfo.summonerId);
                const summonerItem = Translate.riotToSummonerDB(summonerInfo, leagueInfo);
                await DatabaseAPI.putSummoner(summonerItem);
                await interaction.reply(`'s info has been refreshed successfully!`);
                await interaction.editReply(`<@${user.id}>'s info has been refreshed successfully!`);
            }
        } catch (err) {
            console.log(`Error in user refresh: ${err}`);
            await interaction.reply(`There was an error refreshing 's info. Please try again later.`);
            await interaction.editReply(`There was an error refreshing <@${user.id}>'s info. Please try again later.`);
        }
    }

    @Slash("info", { description: "Get the info of a user."})
    async rank(
        @SlashOption("user", {
            description: "User info to get. Leave blank to get your own.",
            type: "USER",
            required: false
        })
        user: User,
        interaction: CommandInteraction
    ) {
        if (!user) user = interaction.user;
        console.log(`COMMAND: Getting info for ${user.username}...`);
        try {
            const userInfo = await DatabaseAPI.getUser(user.id);
            if (!userInfo) {
                await interaction.reply(`There was an error getting 's info. This user has not set a summoner yet.`);
                await interaction.editReply(`There was an error getting <@${user.id}>'s info. This user has not set a summoner yet.`);
            } else {
                await interaction.deferReply();
                const summonerInDatabase = await DatabaseAPI.getSummoner(userInfo.summonerId);
                const embed = Embed.userInfoEmbed(user, summonerInDatabase);
                await interaction.editReply({ embeds: [embed], files:['./assets/esportsLogo.png'] });
            }
        } catch (err) {
            console.log(`Error in user info: ${err}`);
            await interaction.reply(`There was an error getting 's info. Please try again later.`);
            await interaction.editReply(`There was an error getting <@${user.id}>'s info. Please try again later.`);
        }
    }
    

    @SimpleCommand("bing")
    async bing(command: SimpleCommandMessage) {
        command.message.reply("chilling");
    }
}