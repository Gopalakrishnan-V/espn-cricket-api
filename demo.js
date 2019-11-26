const fs = require("fs");
const espn = require("./espn");

(async () => {
  try {
    await espn.init({ headless: false, devtools: false });

    // 1. getTeams
    // const teams = await espn.getTeams();
    // console.log("teams", teams);

    // 2. getTeamPlayers
    // const teamPlayers = await espn.getTeamPlayers({
    //   teamID: "6",
    //   teamSlug: "india"
    // });
    // console.log("teamPlayers", teamPlayers);

    // 3. getPlayerDetails
    // const playerDetails = await espn.getPlayerDetails({
    //   playerID: "253802",
    //   teamSlug: "india"
    // });
    // console.log("playerDetails", playerDetails);

    // 4. search
    // const searchResults = await espn.search({ query: "tendulkar", limit: 2 });
    // console.log(searchResults);

    await espn.close();
  } catch (e) {
    await espn.close();
    console.log(e);
  }
})();

// fs.writeFileSync(
//   `./files/players/virat.json`,
//   JSON.stringify({ ...playerDetails })
// );
