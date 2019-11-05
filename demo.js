const fs = require("fs");
const espn = require("./espn");

(async () => {
  try {
    await espn.init({ headless: false, devtools: false });
    const playerDetails = await espn.getPlayerDetails({
      teamSlug: "india",
      playerID: "253802"
    });

    console.log("playerDetails", playerDetails);

    // fs.writeFileSync(
    //   `./files/players/virat.json`,
    //   JSON.stringify({ ...playerDetails })
    // );

    await espn.close();
  } catch (e) {
    console.log(e);
  }
})();

module.exports = espn;
