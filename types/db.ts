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

type updateExpression = {
    type: string,
    variable: string,
    key?: string,
    value: string
}

type updateFormat = {
    updateExpression: string
    expressionAttributeNames: any
    expressionAttributeValues: any
}

type participantInfo = { // mapped to Discord Snowflake
    id: string // Riot encrypted id
    summonerName: string
    points: number
}

type lobbyInfo = { // mapped to lobby id
    done: boolean
    coordinators: string[] // list of Discord Snowflakes
    participants: string[] // list of Discord Snowflakes
    pointsMatrix?: number[]
}

type tournamentDB = {
    id: string
    description?: string
    timeCreated: number // epoch format, Date.now()
    admins: string[]
    participants?: string[]
    participantMap?: Map<string, participantInfo>
    lobbies?: Map<string, lobbyInfo[]>
}