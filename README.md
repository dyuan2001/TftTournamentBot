# TFT Tournament Bot - built by @dyuan2001
This bot runs tournaments seamlessly with minimal input from admins.\
Tournaments are easy to set up, create, and maintain.\
Manual override features are available if case-by-case actions are needed.

## Functionality
- [x] Store and view ranked TFT information of Discord users
- [ ] TFT tournaments
  - [x] Create tournaments with admins, who can manually override
  - [ ] Partition lobbies automatically according to your specification
  - [ ] Lobby coordinators can report upon game completion for automatic points tallying
  - [ ] Supports custom point distributions
  - [ ] Continue tournaments with new lobbies
- [ ] ... and more to come!

## List of Commands
### [User](#userHeading)
- [`user set`](#userSet)
- [`user refresh`](#userRefresh)
- [`user info`](#userInfo)
### [Tournament](#tournamentHeading)
- [`tournament create`](#tournamentCreate)
- [`tournament delete`](#tournamentDelete)
- [`tournament setdescription`](#tournamentSetDescription)
- [`tournament info`](#tournamentInfo)
- [`tournament participants`](#tournamentParticipants)
- [`tournament register`](#tournamentRegister)
- [`tournament unregister`](#tournamentUnregister)
- [`tournament addadmin`](#tournamentAddAdmin)
- [`tournament removeadmin`](#tournamentRemoveAdmin)

## How to run
To run, download the repository and download all dependencies in `package.json`.\
Then, in the terminal, run `node --loader ts-node/esm/transpile-only index.ts`.\
You can also add the bot to your server using this link: **WIP**

## Dependencies
* discord.ts
* aws-sdk

## Contact me!
If you have any questions about the bot, reach out to me at dyuan@gatech.edu.

# Documentation

## Commands
### <a id="userHeading"></a>User
- <a id="userSet"></a>`user set <summoner>`: Sets a summoner name tied to your Discord account.
  - `<summoner>`: Your TFT summoner name.
- <a id="userRefresh"></a>`user refresh <optional: user>`: Refreshes the user's summoner information.
  - `<user>`: A Discord user. Defaults to you.
- <a id="userInfo"></a>`user info <optional: user>`: Displays your user's summoner information.
  - `<user>`: A Discord user. Defaults to you.
### <a id="tournamentHeading"></a>Tournament
- <a id="tournamentCreate"></a>`tournament create <name> <optional: description> <optional: admin>`: Creates a tournament with a unique name.
  - `<name>`: The tournament name. Must be unique. 
  - `<description>`: A tournament description. Defaults to empty.
  - `<admin>`: An additional admin besides you. Defaults to no one.
- <a id="tournamentDelete"></a>`tournament delete <name> <optional: description> <optional: admin>`: Deletes a tournament. Only usable by admins.
  - `<name>`: The tournament name.
- <a id="tournamentSetDescription"></a>`tournament setdescription <name> <description>`: Sets a tournament's description.
  - `<name>`: The tournament name.
  - `<description>`: The tournament description.
- <a id="tournamentInfo"></a>`tournament info <name> <optional: registration>`: Displays the tournament info.
  - `<name>`: The tournament name.
  - `<registration>`: Displays buttons that allow for instant registration if true, no buttons if false. Defaults to false.
- <a id="tournamentParticipants"></a>`tournament participants <name>`: Displays the list of a tournament's participants.
  - `<name>`: The tournament name.
- <a id="tournamentRegister"></a>`tournament register <name> <optional: user>`: Registers a user for a tournament.
  - `<user>`: A Discord user. Only usable by admins. Defaults to you.
- <a id="tournamentUnregister"></a>`tournament unregister <name> <optional: user>`: Unregisters a user for a tournament.
  - `<user>`: A Discord user. Only usable by admins. Defaults to you.
- <a id="tournamentAddAdmin"></a>`tournament addadmin <name> <user>`: Adds a user as a tournament admin. Only usable by admins.
  - `<user>`: A Discord user.
- <a id="tournamentRemoveAdmin"></a>`tournament removeadmin <name> <user>`: Removes a user as a tournament admin. Only usable by admins.
  - `<user>`: A Discord user.