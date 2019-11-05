const getNewPage = async browser => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  // page.on("console", console.log);

  page.on("request", req => {
    if (req.resourceType() === "image") {
      req.abort();
    } else if (
      req.resourceType() === "stylesheet" ||
      req.resourceType() === "font"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page;
};

module.exports = { getNewPage };
