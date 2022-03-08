import { Translate } from "../api/translate.js";
import { MessageEmbed, User } from "discord.js";
import { client } from "../index.js";

export class Embed {
    /**
     * User info embed that contains information in summonerDB.
     * @param user Discord user with summoner id matching summonerInDatabase.
     * @param summonerInDatabase Current summonerDB of user.
     * @returns User info embed with appropriate values.
     */
    static userInfoEmbed(user: User, summonerInDatabase: summonerDB): MessageEmbed {
        const winrate: string = ((summonerInDatabase.wins + summonerInDatabase.losses) > 0)
                                ? ((summonerInDatabase.wins / (summonerInDatabase.wins + summonerInDatabase.losses)) * 100).toFixed(2)
                                : `0.00`;

        let embed = new MessageEmbed()
            .setTitle(`${summonerInDatabase.summonerName}'s Stats`)
            .setDescription(`<@${user.id}>`)
            .setAuthor({ name: 'TFT Bot', iconURL: `${client.user.avatarURL()}` })
            .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
            .addFields(
                { name: 'Rank', value: `${Translate.readableRank(summonerInDatabase, true)}` },
                { name: 'Wins', value: `${summonerInDatabase.wins}`, inline: true },
                { name: 'Losses', value: `${summonerInDatabase.losses}`, inline: true },
                { name: 'Winrate', value: `${winrate}%`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `Built by @dyuan2001 on GitHub.`, iconURL: 'attachment://esportsLogo.png' });

        return embed;
    }
}