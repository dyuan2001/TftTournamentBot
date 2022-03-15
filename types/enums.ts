export const enum updateType {
    NO_INSERT = 0,
    NO_COND,
    COND,
    SET,
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
    UPDATE_COND_FAIL = 'The conditional request failed.',
    COLLECTOR_TIMEOUT = 'Collector received no interactions before ending with reason: time'
}

export const enum days {
    M = 'Monday',
    T = 'Tuesday',
    W = 'Wednesday',
    R = 'Thursday',
    F = 'Friday',
    S = 'Saturday',
    U = 'Sunday'
}

export const enum timeGranularity {
    day = 0,
    week,
    month
}