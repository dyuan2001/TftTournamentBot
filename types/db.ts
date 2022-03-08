type userDB = {
    id: string
    avatar?: string | null
    username?: string
    summonerId?: string
}

type summonerDB = {
    accountId: string
    summonerName: string
    id: string
    puuid: string
    queueType?: string
    tier?: string
    rank?: string
    leaguePoints?: number
    wins?: number
    losses?: number
}