const captureWebsite = require("capture-website");
const parameterize = require("parameterize");
const { devicesMap } = require("puppeteer/DeviceDescriptors");

const prependHttp = require("./prependHttp");
const removeHttp = require("./removeHttp");

const defaults = {
  overwrite: true,
  scaleFactor: 1,
};

const getCapture = async (url, options = {}) => {
  const opts = { ...defaults, ...options };
  const filename = Date.now() + "_" + parameterize(removeHttp(url));
  const filepath = `images/${filename}.png`;
  await captureWebsite.file(prependHttp(url), filepath, opts);
  return filepath;
};

module.exports = getCapture;
