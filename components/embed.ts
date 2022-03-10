import { Translate } from "../api/translate.js";
import { MessageEmbed, User } from "discord.js";
import { client } from "../index.js";

export class Embed {
    static readonly maxParticipants = 8;

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
                { name: 'Games', value: `${summonerInDatabase.losses + summonerInDatabase.wins}`, inline: true },
                { name: 'Winrate', value: `${winrate}%`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: `Built by @dyuan2001 on GitHub.`, iconURL: 'attachment://esportsLogo.png' });
        console.log(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);
        return embed;
    }

    static tournamentInfoEmbed(tournamentInfo: tournamentDB): MessageEmbed {
        let adminsString = '';
        for (const admin of tournamentInfo.admins) {
            adminsString += `<@${admin}>\n`;
        }
        adminsString = adminsString.slice(0, -1);

        let embed = new MessageEmbed()
            .setTitle(`${tournamentInfo.id} Info`)
            .setDescription(`${tournamentInfo.description}`)
            .setAuthor({ name: 'TFT Bot', iconURL: `${client.user.avatarURL()}` })
            .addFields(
                { name: 'Participants', value: `${tournamentInfo.participants.length}` },
                { name: 'Admins', value: `${adminsString}` }
            )
            .setTimestamp()
            .setFooter({ text: `Built by @dyuan2001 on GitHub.`, iconURL: 'attachment://esportsLogo.png' });
        
        return embed;
    }

    static tournamentParticipantsEmbed(startIndex: number, endIndex: number, participants: userDB[], tournament: tournamentDB): MessageEmbed {
        let discordNames = '';
        let summonerNames = '';

        for (let i = startIndex; i < endIndex; i++) {
            discordNames += `<@${participants[i].id}>\n`;
            summonerNames += `${participants[i].summonerName}\n`;
        }
        discordNames = discordNames.slice(0, -1);
        summonerNames = summonerNames.slice(0, -1);
        
        let embed = new MessageEmbed()
            .setTitle(`${tournament.id} participants: ${startIndex + 1}-${endIndex} of ${participants.length}`)
            .setAuthor({ name: 'TFT Bot', iconURL: `${client.user.avatarURL()}` })
            .addFields(
                { name: 'Discord', value: `${discordNames}`, inline: true },
                { name: 'Summoner', value: `${summonerNames}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Built by @dyuan2001 on GitHub.`, iconURL: 'attachment://esportsLogo.png' });
        
        return embed;
    }
}