# Tournament Flow
An overview of each phase of a tournament and the commands associated with each one. \
You can do previous phases' commands if you want (unless otherwise specified), but you can't go forward.

## Phase 1: Check In
The tournament check in begins.\
Participants must check in to be eligible to be matched into a lobby.\
Admins are able to set settings for rounds preemptively.
### Phase 1 Commands
  - `tm setdefault`: Sets the default tournament for your user.
  - `tm setsettings`: Ephermal dropdown menu of various options (all optional!). SETS FOR ROUND(S). very important! Format, points, description.
  - `tm begincheckin`: Starts check in period for participants. "are you sure?" Only usable by admins.
  - `tm checkin`: Checks in yourself. You can't check in for other people.
  - `tm checkout`: Checks out yourself. You can't check out for other people (remove them instead as admin).
  - `tm participants`: Shows a list of active participants.
  - `tm info`: Displays an embed of the tournament's description, active participants, admins, and round number.
## Phase 2: Tournament Begins
The tournament officially begins and the check in command is disabled for players. \
Admins can make last minute adjustments to the player list. \
Admins must set the settings for the next round now or use the default settings.
### Phase 2 Commands
  - `tm begintournament`: Start tournament. Ends check in period. "are you sure?"
  - `tm addparticipant`: Adds a participant mid-tourney. If present already, marks them active. Admin
  - `tm removeparticipant`: Removes a participant mid-tourney. Marks them inactive. Admin
  - `tm points`: Displays points for an individual (each round + total) and placements.
  - `tm leaderboard`: Displays the current leaderboard.
## Phase 3:
A round is set up with the specified settings, which are locked in. \
Admins are able to remake the lobbies if desired and move players to different lobbies.
### Phase 3 Commands
  - `tm makeround`: Starts with settings specified for round. Prints out settings for that round for "are you sure?". Admin
  - `tm deleteround`: Deletes a round and goes back to phase 3. Does not reset the number "are you sure? like really sure". Really shouldn't be used. Admin
  - `tm remakelobbies`: Remakes the lobbies with the specified settings. Admin // CAN'T USE AFTER PHASE 3
  - `tm addplayer`: Adds player to a particular lobby. Must not be in a lobby already (marks in user info as present). Admin
  - `tm removeplayer`: Removes player from a particular lobby. Must be in that lobby. Admin
  - `tm addcoordinator`: Add an individual as a coordinator for their lobby. Admin.
  - `tm removecoordinator`: Remove an individual as a coordinator for their lobby. Admin.
  - `tm roundinfo`: Shows settings for round, description, and general points distribution.
  - `tm lobbies`: Shows lobby specified OR a scrollable list of lobbies. Defaults to list.
## Phase 4:
The round begins and the lobbies are locked in. \
Coordinators are able to report that their lobby has completed their game. \
Points are automatically distributed upon the round being reported.
### Phase 4 Commands
  - `tm beginround`: Enables reporting for that round. Lobbies are LOCKED, of valid size (<=8), and all players are in a lobby. Prints all lobbies individually. Admin.
  - `tm report`: Reports the lobby being done. Sends an embed of the last match w/ all participants for confirmation. Automatically distributes points based on placement IF points not set. Coordinators/Admins
  - `tm setpoints`: Set an individual's points for a round manually. Admin.
  - `tm setplacement`: Set an individual's placement manually. Admin.
  - `tm setlobbyplacements`: Set all placements for a lobby with drop-down menu. Admin.
  - `tm setreported`: Set a lobby as functionally reported. Shouldn't happen usually "are you sure?". Admin.
  - `tm setallreported`: Sets all lobbies as reported. Really shouldn't happen "are you sure?". Admin.
  - `tm lobbiesinprogress`: Displays a list of unreported lobbies.
  - `tm lobbiespoints`: Displays points for all lobbies (scrollable) or a specified one.
  
(Phases 3-4 are repeated until rounds end.) Another round cannot start until all lobbies are reported.

## Phase 5:
The tournament ends and the leaderboard is printed.
### Phase 5 Commands
  - `tm end`: Ends the tournament and sends the results. Stores in separate database. "are you sure?" Admin.
  - `tm results`: Sends the results.
    