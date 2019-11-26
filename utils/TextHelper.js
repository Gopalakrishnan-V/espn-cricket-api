module.exports.getTeamSlugFromResult = item => {
  if (item && item.links && item.links[0] && item.links[0].href) {
    const url = item.links[0].href;
    return url.replace(/.*espncricinfo.com\//, "").replace(/\/.*/, "");
  }
  return "ci";
};
