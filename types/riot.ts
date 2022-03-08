type summonerItem = {
    accountId: string
    profileIconId: number
    revisionDate: number
    name: string
    id: string
    puuid: string
    summonerLevel: number
}

type leagueItem = {
    leagueId?: string
    summonerId: string
    summonerName: string
    queueType: string
    ratedTier?: string
    ratedRating?: number
    tier?: string
    rank?: string
    leaguePoints?: number
    wins: number
    losses: number
    hotStreak?: boolean
    veteran?: boolean
    freshBlood?: boolean
    inactive?: boolean
}