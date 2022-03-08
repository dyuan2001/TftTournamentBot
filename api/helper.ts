import { RiotAPI } from "./riot.js";
import { DatabaseAPI } from "./db.js";
import { Translate } from "./translate.js";

export class Helper {
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
}