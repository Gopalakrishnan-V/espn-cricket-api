const getNewPage = async browser => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  // page.on("console", console.log);

  page.on("request", req => {
    const abortedTypes = ["image", "stylesheet", "font", "script", "xhr"];
    if (abortedTypes.includes(req.resourceType())) {
      req.abort();
    } else {
      // console.log(page.url(), req.url());
      req.continue();
    }
  });
  return page;
};

module.exports = { getNewPage };
