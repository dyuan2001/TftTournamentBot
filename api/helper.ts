import { RiotAPI } from "./riot.js";
import { DatabaseAPI } from "./db.js";
import { Translate } from "./translate.js";
import { User } from "discord.js";
import { tournamentErrorType } from "../types/enums.js";

export class Helper {
    static readonly tournamentExpiryTime: number = 2629800000;

    /**
     * Helper function to get a summonerDB from a summoner name.
     * Puts the summonerDB in table summoner-table if not present.
     * @param name TFT summoner name.
     * @param alwaysUpdate Always update Riot info in table summoner-table.
     * @returns summonerDB object of summoner name parameter.
     */
    static async getSummonerFromName(name: string, alwaysUpdate: boolean): Promise<summonerDB> {
        const summoner = await RiotAPI.fetchSummoner(name);
        const id = summoner.id;
        const summonerInDatabase = await DatabaseAPI.getSummoner(id);

        if (summonerInDatabase && !alwaysUpdate) {
            console.log(`Found summoner ${name} in database, returning`);
            return summonerInDatabase;
        } else {
            console.log(`No summoner ${name} in database or alwaysUpdate, fetching from Riot`);
            const league = await RiotAPI.fetchLeague(id);
            const summonerDB = Translate.riotToSummonerDB(summoner, league);
            await DatabaseAPI.putSummoner(summonerDB);
            return summonerDB;
        }
    }
    
    /**
     * Helper function to put a tournamentDB if there is no ID conflict.
     * @param tournament tournamentDB to be put if possible.
     * @returns tournamentDB object defined by parameter or a rejected Promise.
     */
    static async putTournamentIfAvailableOrExpired(tournament: tournamentDB): Promise<tournamentDB> {
        const tournamentInDatabase = await DatabaseAPI.getTournament(tournament.id);
        if (tournamentInDatabase && Date.now() - tournamentInDatabase.timeCreated < this.tournamentExpiryTime) {
            return Promise.reject(new Error(`iderror`)); // errors out
        } else {
            const tournamentNew = await DatabaseAPI.putTournament(tournament);
            return tournamentNew;
        }
    }

    /**
     * Helper function to check if a user is an admin of a tournament.
     * @param user User to check for admin privileges.
     * @param tournament tournamentDB of relevant tournament.
     * @returns True if user is an admin, False if not.
     */
    static async checkAdmin(user: User, tournament?: tournamentDB, tournamentId?: string): Promise<tournamentDB> {
        if (!tournament) {
            tournament = await DatabaseAPI.getTournament(tournamentId);
            if (!tournament) throw new Error(tournamentErrorType.NO_TOURNAMENT);
        }
        if (tournament.admins.indexOf(user.id) < 0) {
            throw new Error(tournamentErrorType.NOT_ADMIN);
        }
        return tournament;
    }
}