const fs = require("fs");
const path = require("path");
const PNG = require("pngjs").PNG;
const compareImages = require("resemblejs/compareImages");

const defaults = {
  output: {
    errorColor: {
      red: 255,
      green: 240,
      blue: 11,
    },
    errorType: "flat",
    transparency: 0.4,
    largeImageThreshold: 2400,
    useCrossOrigin: false,
    outputDiff: true,
  },
  scaleToSameSize: true,
  ignore: "less",
};

const getCompare = async (img1, img2, options = {}) => {
  try {
    const opts = { ...defaults, ...options };
    const file1 = PNG.sync.read(fs.readFileSync(img1));
    const file2 = PNG.sync.read(fs.readFileSync(img2));

    const data = await compareImages(file1, file1, options);

    const filename = Date.now() + "_" + "result";
    const filepath = `images/${filename}.png`;
    await fs.writeFileSync(filepath, data.getBuffer());
    return filepath;
  } catch (error) {
    throw error;
  }
};

module.exports = getCompare;
