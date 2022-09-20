import { CommandInteraction, User } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup("tm", "Tournament management commands for tournament day needs.")
export class TournamentManagementPhase2Commands {
    /*
    List of commands for phase 2:
        tm begintournament
        tm addparticipant
        tm removeparticipant
        tm points
        tm leaderboard
    */
    
}