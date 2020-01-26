const puppeteer = require("puppeteer");
const { getNewPage } = require("./utils/PageHelper");
const {
  BASE_URL,
  TEAMS_URL,
  FORMATS,
  FORMATS_V2_MAP,
  BATTING_ATTRIBUTES,
  BOWLING_ATTRIBUTES
} = require("./utils/Constants");
const { getTeamSlugFromResult } = require("./utils/TextHelper");

let browser = null;

const espn = {
  init: (config = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        /* Creating a new browser instance */
        config.headless = true;
        config.devtools = false;
        config.args = config.args || [
          "--no-sandbox",
          "--disable-setuid-sandbox"
        ];
        browser = await puppeteer.launch(config);

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  getTeams: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const page = await getNewPage(browser);
        await page.goto(TEAMS_URL);
        const teams = await page.$$eval(
          "div.article-body > p > a[href*='/team']",
          elements =>
            elements.map(element => {
              /* Each element represents a country Ex: India, Australia */
              const url = element.getAttribute("href");

              const [id] = url.match(/[0-9]+/);
              const slug = url.replace(/.*[0-9]\//, "").replace("/", "");
              const name = element.textContent;
              return { id, slug, name };
            })
        );
        await page.close();
        resolve(teams);
      } catch (e) {
        reject(e);
      }
    });
  },
  getTeamPlayers: ({ teamID, teamSlug = "ci" }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const page = await getNewPage(browser);
        await page.goto(
          `http://www.espncricinfo.com/${teamSlug}/content/player/country.html?country=${teamID}`
        );
        const result = await page.$$eval(
          "table.playersTable > tbody",
          (tbodies, FORMATS) => {
            const result = {};
            for (let i in tbodies) {
              /* Block containing players of one format */
              const tbody = tbodies[i];
              const players = [];

              let trs = Array.from(tbody.children);
              trs = trs.filter(tr => tr.childElementCount);
              trs.map(tr => {
                /* Each tr contains three tds(players) */
                const tds = Array.from(tr.children);

                tds.map(td => {
                  /* Each td represents a player */
                  const name = td.textContent;
                  const url = td.firstElementChild.getAttribute("href");
                  const [id] = url.match(/[0-9]+/);
                  players.push({ id, name });
                });
              });

              /* FORMATS is enum containing all, test, odi, etc., */
              const formatName = FORMATS[i];
              result[formatName] = players;
            }
            return result;
          },
          FORMATS
        );
        await page.close();
        resolve({ teamID, teamSlug, players: result });
      } catch (e) {
        reject(e);
      }
    });
  },
  getPlayerDetails: ({ playerID, teamSlug = "ci" }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const page = await getNewPage(browser);
        await page.goto(
          `http://www.espncricinfo.com/${teamSlug}/content/player/${playerID}.html`
        );
        const name = await page.$eval("div.ciPlayernametxt > div > h1", el =>
          el.textContent.trim()
        );
        const teamName = await page.$eval("h3.PlayersSearchLink > b", el =>
          el.textContent.trim()
        );

        const avatar = await page.evaluate(async () => {
          const el = await document.querySelector(
            "img[src*='/inline/content/image']"
          );
          return el ? el.currentSrc : null;
        });

        const {
          fullName,
          born,
          majorTeams,
          playingRole,
          battingStyle,
          bowlingStyle
        } = await page.$$eval("div > p.ciPlayerinformationtxt", els => {
          return {
            fullName: els[0].lastElementChild.textContent.trim(),
            born: els[1].lastElementChild.textContent.trim(),
            majorTeams: els[3].textContent
              .replace("Major teams", "")
              .trim()
              .split(",")
              .map(majorTeam => majorTeam.trim()),
            playingRole: els[4].lastElementChild.textContent.trim(),
            battingStyle: els[5].lastElementChild.textContent.trim(),
            bowlingStyle: els[6].lastElementChild.textContent.trim()
          };
        });

        const batting = await page.$$eval(
          "table.engineTable:nth-of-type(1) > tbody > tr",
          (trs, FORMATS_V2_MAP, BATTING_ATTRIBUTES) => {
            const result = {};
            for (let i in trs) {
              const formatStats = {};

              /* Each tr represents a format */
              const tr = trs[i];

              /* Format Label. Ex: Tests, ODIs, T20Is, First-class, List A, T20s */
              const formatLabel = tr.children[0].textContent;
              const formatKey = formatLabel
                ? FORMATS_V2_MAP[formatLabel]
                : null;

              /* Each td represents a column such as mat, inns, etc., */
              const tds = Array.from(tr.children).filter(
                td => td.className === "" || td.className === "padAst"
              );

              tds.map((td, tdIndex) => {
                const attribute = BATTING_ATTRIBUTES[tdIndex];
                const { key, type } = attribute;

                let textContent = td.textContent.trim();
                formatStats[key] =
                  type === "string" ? textContent : Number(textContent);
              });

              if (formatKey) {
                result[formatKey] = formatStats;
              }
            }
            return result;
          },
          FORMATS_V2_MAP,
          BATTING_ATTRIBUTES
        );

        const bowling = await page.$$eval(
          "table.engineTable:nth-of-type(2) > tbody > tr",
          (trs, FORMATS_V2_MAP, BOWLING_ATTRIBUTES) => {
            const result = {};
            for (let i in trs) {
              const formatStats = {};

              /* Each tr represents a format */
              const tr = trs[i];

              /* Format Label. Ex: Tests, ODIs, T20Is, First-class, List A, T20s */
              const formatLabel = tr.children[0].textContent;
              const formatKey = formatLabel
                ? FORMATS_V2_MAP[formatLabel]
                : null;

              /* Each td represents a column such as mat, inns, etc., */
              const tds = Array.from(tr.children).filter(
                td => td.className === "" || td.className === "padAst"
              );

              tds.map((td, tdIndex) => {
                const attribute = BOWLING_ATTRIBUTES[tdIndex];
                const { key, type } = attribute;

                let textContent = td.textContent.trim();
                formatStats[key] =
                  type === "string" ? textContent : Number(textContent);
              });

              if (formatKey) {
                result[formatKey] = formatStats;
              }
            }
            return result;
          },
          FORMATS_V2_MAP,
          BOWLING_ATTRIBUTES
        );

        await page.close();
        resolve({
          name,
          teamName,
          avatar,
          fullName,
          born,
          majorTeams,
          playingRole,
          battingStyle,
          bowlingStyle,
          batting,
          bowling
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  search: ({ query = "", limit = 5 }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const page = await getNewPage(browser);
        const result = await page.evaluate(
          async (query, limit) => {
            try {
              const response = await fetch(
                `https://site.api.espn.com/apis/common/v3/search?sport=cricket&query=${query}&limit=${limit}&type=player&mode=prefix&lang=en&region=in&site=espncricinfo&section=cricinfo`
              );
              const text = await response.json();
              return text;
            } catch (e) {
              return e;
            }
          },
          query,
          limit
        );

        await page.close();
        if (result.items) {
          result.items = result.items.map(item => {
            return { ...item, teamSlug: getTeamSlugFromResult(item) };
          });
          resolve(result.items);
        } else {
          reject(new Error(result.message));
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  close: () => {
    return new Promise(async (resolve, reject) => {
      try {
        await browser.close();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
};

module.exports = espn;
