const captureWebsite = require("capture-website");
const parameterize = require("parameterize");

const prependHttp = require("./prependHttp");
const removeHttp = require("./removeHttp");

const defaults = {
  width: 1440,
  emulateDevice: "iPhone X",
  overwrite: true,
};

const getCapture = async (url, options = {}) => {
  const opts = { ...defaults, ...options };
  const filename = Date.now() + "_" + parameterize(removeHttp(url));
  const filepath = `images/${filename}.png`;
  await captureWebsite.file(prependHttp(url), filepath, opts);
  return filepath;
};

module.exports = getCapture;
