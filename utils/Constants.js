const BASE_URL = "http://www.espncricinfo.com/";
const TEAMS_URL =
  "https://www.espncricinfo.com/story/_/id/18791072/all-cricket-teams-index";

const FORMATS = ["all", "test", "odi", "t20", "contract"];
const FORMATS_V2_MAP = {
  Tests: "tests",
  ODIs: "odis",
  T20Is: "t20is",
  "First-class": "firstClass",
  "List A": "listA",
  T20s: "t20s"
};

const BATTING_ATTRIBUTES = [
  { key: "matches", type: "number" },
  { key: "innings", type: "number" },
  { key: "notouts", type: "number" },
  { key: "runs", type: "number" },
  { key: "highest", type: "string" },
  { key: "average", type: "number" },
  { key: "ballsFaced", type: "number" },
  { key: "strikeRate", type: "number" },
  { key: "hundreds", type: "number" },
  { key: "fifties", type: "number" },
  { key: "fours", type: "number" },
  { key: "sixes", type: "number" },
  { key: "catches", type: "number" },
  { key: "stumpings", type: "number" }
];

const BOWLING_ATTRIBUTES = [
  { key: "matches", type: "number" },
  { key: "innings", type: "number" },
  { key: "balls", type: "number" },
  { key: "runs", type: "number" },
  { key: "wickets", type: "number" },
  { key: "bestBowlingInInnings", type: "string" },
  { key: "bestBowlingInMatch", type: "string" },
  { key: "average", type: "number" },
  { key: "economy", type: "number" },
  { key: "strikeRate", type: "number" },
  { key: "fourWicketHaul", type: "number" },
  { key: "fiveWicketHaul", type: "number" },
  { key: "tenWicketHaul", type: "number" }
];

module.exports = {
  BASE_URL,
  TEAMS_URL,
  FORMATS,
  FORMATS_V2_MAP,
  BATTING_ATTRIBUTES,
  BOWLING_ATTRIBUTES
};
