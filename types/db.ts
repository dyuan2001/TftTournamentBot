type userDB = {
    id: string
    avatar?: string | null
    username?: string
    summonerId?: string
    summonerName?: string
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

type snapshotDB = {
    id: string
    ttl: number
    description?: string
    admins: string[]
    participants: string[]
    jobs: job[]
}

type job = {
    name: string
    path: string
    interval: string
    startDate: Date
    endDate: Date
}

type updateExpression = {
    type: number,
    variable?: string,
    value?: any
}

type updateFormat = {
    updateExpression: string
    expressionAttributeNames: any
    expressionAttributeValues: any
    conditionalExpression: string
}

type batchGetExpression = {
    pk: string
    table: string
}

type participantInfo = { // mapped to Discord Snowflake
    id: string // Riot encrypted id
    summonerName: string
    points: number
}

type lobbyInfo = { // mapped to lobby id
    done: boolean
    coordinators: Set<string> // list of Discord Snowflakes
    participants: Set<string> // list of Discord Snowflakes
    pointsMatrix?: number[]
}

type tournamentDB = {
    id: string
    description?: string
    timeCreated: number // epoch format, Date.now()
    admins: string[]
    participants?: string[]
    participantMap?: Map<string, participantInfo>
    lobbies?: Map<string, lobbyInfo>
}