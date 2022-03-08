export class Translate {
    /**
     * Translates Riot API objects into summonerDB object.
     * @param summoner Riot API summonerItem.
     * @param league Riot API leagueItem.
     * @returns summonerDB object defined by Riot API objects.
     */
    static riotToSummonerDB(summoner: summonerItem | summonerDB, league: leagueItem): summonerDB {
        let summonerName = ('name' in summoner) ? summoner.name : summoner.summonerName;
        let item: summonerDB = {
            accountId: summoner.accountId,
            summonerName: summonerName,
            id: summoner.id,
            puuid: summoner.puuid,
            queueType: "RANKED_TFT",
            tier: "UNRANKED",
            rank: "I",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
        };
        if (!league) return item;
        if (league.summonerName) item.summonerName = league.summonerName;
        if (league.queueType) item.queueType = league.queueType;
        if (league.tier) item.tier = league.tier;
        if (league.rank) item.rank = league.rank;
        if (league.leaguePoints) item.leaguePoints = league.leaguePoints;
        if (league.wins) item.wins = league.wins;
        if (league.losses) item.losses = league.losses;
        return item;
    }

    /**
     * Translates Riot tier, rank, and leaguePoints into one human-readable string.
     * @param summonerInDatabase summonerDB to translate.
     * @param lp Include leaguePoints in string or not.
     * @returns Human-readable string for rank.
     */
    static readableRank(summonerInDatabase: summonerDB, lp: boolean): string {
        const lowercaseTier = summonerInDatabase.tier.toLowerCase();
        const tier = summonerInDatabase.tier[0] + lowercaseTier.slice(1);
        let rank = tier;
        
        if (!(tier === 'Unranked' || tier === 'Master' || tier === 'Grandmaster' || tier === 'Challenger')) {
            rank += ` ${summonerInDatabase.rank}`;
        }
        if (lp && tier !== 'Unranked') {
            rank += ` ${summonerInDatabase.leaguePoints} LP`;
        }
        return rank;
    }

    /**
     * Translates a list of updateExpressions into the DocumentClient update format.
     * @param updateExpressionArray List of updateExpressions for one object.
     * @returns updateFormat containing updateExpression, expressionAttributeNames, and expressionAttributeValues.
     */
    static updateExpressionArrayToUpdateFormat(updateExpressionArray: updateExpression[]): updateFormat {
        let updateExpression: string = '';
        let expressionAttributeNames = {};
        let expressionAttributeValues = {};
        for (let i = 0; i < updateExpressionArray.length; i++) {
            const currExpression = updateExpressionArray[i];
            if (currExpression.type === 'set') {
                updateExpression += `SET #${currExpression.variable}${i} = :${currExpression.variable}${i} `;
            } else if (currExpression.type === 'appendlist') {
                updateExpression += `SET #${currExpression.variable}${i} = list_append(#${currExpression.variable}${i}, :${currExpression.variable}${i}) `;
            } else if (currExpression.type === 'appendmap') {
                updateExpression += `SET #${currExpression.variable}${i}.${currExpression.key} = :${currExpression.variable}${i}`;
            }
            expressionAttributeNames[`#${currExpression.variable}${i}`] = currExpression.variable;
            expressionAttributeValues[`:${currExpression.variable}${i}`] = currExpression.value;
        }

        let retObject: updateFormat = {
            updateExpression,
            expressionAttributeNames,
            expressionAttributeValues
        }
        return retObject;
    }
}