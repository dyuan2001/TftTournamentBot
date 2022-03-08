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
    ALREADY_ADMIN = 'already admin',
    NOT_ADMIN = 'not admin',
    NO_ADMIN_PERMISSION = 'no admin permission',
    UPDATE_CONDITION = 'The conditional request failed.'
}