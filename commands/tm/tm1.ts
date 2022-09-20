import { CommandInteraction, User } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

@Discord()
@SlashGroup("tm", "Tournament management commands for tournament day needs.")
export class TournamentManagementPhase1Commands {
    /*
    List of commands for phase 1:
        tm setdefault
        tm setsettings
        tm begincheckin
        tm checkin
        tm checkout
        tm participants
        tm info
    */
    
}