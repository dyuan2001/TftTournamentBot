export class TournamentManagementCommands {
    /*
    List of commands:
    You can do previous phases' commands if you want, but you can't go forward per round.
    Phase 1:
        tm setsettings: Ephermal dropdown menu of various options (all optional!). SETS FOR ROUND(S). very important! Format, points, description.
        tm begincheckin: Starts check in period for participants. "are you sure?" Only usable by admins.
        tm checkin: Checks in yourself. You can't check in for other people.
        tm checkout: Checks out yourself. You can't check out for other people (remove them instead as admin).
        tm participants: Shows a list of active participants.
        tm info: *Not sure if I want this* Displays an embed of the tournament's description, active participants, admins, and round number.
    Phase 2:
        tm begintournament: Start tournament. Ends check in period. "are you sure?"
        tm addparticipant: Adds a participant mid-tourney. If present already, marks them active. Admin
        tm removeparticipant: Removes a participant mid-tourney. Marks them inactive. Admin
        tm points: Displays points for an individual (each round + total).
        tm leaderboard: Displays the current leaderboard.
    Phase 3:
        tm beginround: Starts with settings specified for round. Prints out settings for that round for "are you sure?". Admin
        tm deleteround: Deletes a round and goes back to phase 3. Does not reset the number "are you sure? like really sure". Really shouldn't be used. Admin
        tm remakelobbies: Remakes the lobbies with the specified settings. Admin // CAN'T USE AFTER PHASE 3
        tm addplayer: Adds player to a particular lobby. Must not be in a lobby already (marks in user info as present). Admin
        tm removeplayer: Removes player from a particular lobby. Must be in that lobby. Admin
        tm addcoordinator: Add an individual as a coordinator for their lobby. Admin.
        tm removecoordinator: Remove an individual as a coordinator for their lobby. Admin.
        tm roundinfo: Shows settings for round, description, and general points distribution.
        tm lobbies: Shows lobby specified OR a scrollable list of lobbies. Defaults to list.
    Phase 4:
        tm confirmround: Enables reporting for that round. Lobbies are LOCKED, of valid size (<=8), and all players are in a lobby. Prints all lobbies individually. Admin.
        tm report: Reports the lobby being done. Sends an embed of the last match w/ all participants. Coordinators/Admins
        tm setpoints: Set an individual's points for a round manually. Admin.
        tm setreported: Set a lobby as functionally reported. Shouldn't happen usually "are you sure?". Admin.
        tm setallreported: Sets all lobbies as reported. Really shouldn't happen "are you sure?". Admin.
        tm lobbiesinprogress: Displays a list of unreported lobbies.
        tm lobbiespoints: Displays points for all lobbies (scrollable) or a specified one.
    (Phases 3-4 are repeated until rounds end.) Another round cannot start until all lobbies are reported.
    
    */
}