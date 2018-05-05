### Discord Inactivity Checker

This is a simple script designed to run through a Discord server's member list, check their join date and their last message, and if they haven't posted a message within a certain period, log out their mention codes to the console for you to do with as you wish.

## Installation

Clone this repository and call `npm i` or `yarn`.

## Config

Three environment variables must be set (.env files are supported).

* `DISCORD_USER_TOKEN` is your user token, accessible via your Discord localstorage. This must be a user account, bot accounts do not work with the search functionality used in this script.

* `DISCORD_SERVER_ID` is the ID of the server you wish to scan.

* `DISCORD_GRACE_PERIOD` is the amount of time, in milliseconds, you wish to allow new users to be in the server before the inactivity check applies to them.

## Running the script

Call `npm start` or `yarn start`

The script will look through all users and will

* Fetch their join date
* Fetch their most recent message
* Calculate the time since their join date
* Calculate the time since their most recent message
* Check if the time since since their most recent message is greater than half the time since their join date
* Log out a list of the mention codes of all users who's fit the above condition
