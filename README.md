# ESPN Cricket API

ESPN Cricket API is a Node JS library for fetching data such as player details, team players list, search players, etc.,

## Installation

```bash
npm install espn-cricket-api
```

## Usage

#### Import
```
const espn = require("espn-cricket-api");
```

All the below functions return promise
#### 1. Get list of teams
```
const teams = await espn.getTeams();
```

#### 2. Get list of players in a team
```
const teamPlayers = await espn.getTeamPlayers({
  teamID: "6",
  teamSlug: "india"
});
```

#### 3. Get details of a player      
```
const playerDetails = await espn.getPlayerDetails({
  playerID: "253802",
  teamSlug: "india"
});
```  

#### 4. Search for players by keyword
```
const searchResults = await espn.search({
 query: "virat",
 limit: 10
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[ISC](https://opensource.org/licenses/ISC)