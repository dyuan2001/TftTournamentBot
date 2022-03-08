export const enum updateType {
    SET = 0,
    ADDLIST,
    ADDMAP,
    REMOVELIST
}

export const enum tournamentErrorType {
    DUPLICATE_TOURNAMENT = 'iderror',
    NO_SUMMONER_NAME = 'no summoner name',
    NO_TOURNAMENT = 'no tournament',
    ALREADY_REGISTERED = 'already registered',
    NOT_REGISTERED = 'not registered',
    NOT_ADMIN = 'not admin',
    UPDATE_CONDITION = 'The conditional request failed.'
}