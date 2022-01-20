import 'dotenv/config';
import fetch from 'node-fetch';

/**
 * Wrapper class for all Riot API calls.
 */
export class RiotAPI {
    /**
     * Generic fetch helper function.
     * @param url URL used in fetch function.
     * @returns Promise for predetermined types in types.ts.
     */
    static async fetchGeneric(url: string): Promise<any> {
        const response = await fetch(url, {
            headers: {"X-Riot-Token": process.env.RIOT_KEY}
        });

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            const error = JSON.stringify(data);
            console.log(error);
            return Promise.reject(error);
        }
    }

    /**
     * Fetch user info from /lol/summoner/v4/summoners/by-name/{summonerName}.
     * @param summonerName Summoner name.
     * @returns Promise for object containing summoner information.
     */
    static async fetchSummoner(summonerName: string): Promise<summonerItem> {
        // Update DB no matter what if this is called!

        const item: summonerItem = await this.fetchGeneric(`https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${summonerName}`);
        return item;
    }

    /**
     * Fetch league info from /tft/league/v1/entries/by-summoner/{summonerId}.
     * @param summonerId Encrypted summoner id.
     * @returns Promise for object containing league information.
     */
     static async fetchLeague(summonerId: string): Promise<leagueItem> { // need to specify custom return type for JSON obj
        // Check if DB has encrypted summoner id or not. NOTE: should include a "name changed" function to account for stuff.
        const item: Array<leagueItem> = await this.fetchGeneric(`https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}`);
        return item[0];
    }
}
