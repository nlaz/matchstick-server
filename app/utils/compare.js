const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const PNG = require("pngjs").PNG;
const compareImages = require("resemblejs/compareImages");

const defaults = {
  output: {
    errorColor: {
      red: 255,
      green: 3,
      blue: 255,
    },
    errorType: "flat",
    transparency: 1,
    largeImageThreshold: 1000000,
    useCrossOrigin: false,
    outputDiff: true,
  },
  scaleToSameSize: true,
  ignore: "antialiasing",
};

function createCanvas(width, height) {
  return Canvas.createCanvas(width, height);
}

const normalise = async (img, w, h) => {
  const c = createCanvas(w, h);
  const context = c.getContext("2d");
  const background = await Canvas.loadImage(img);
  context.drawImage(background, 0, 0);
  return context.getImageData(0, 0, w, h);
};

const matchImages = async (img1, img2, h) => {
  const norm1 = await normalise(img1, width, height);
  const norm2 = await normalise(img2, width, height);
};

const matchDimensions = (file1, file2) => {};

const getCompare = async (img1, img2, options = {}) => {
  try {
    const errorColor = options.errorColor || defaults.errorColor;
    const output = { ...defaults.output, errorColor };
    const opts = { ...defaults, output };

    let file1 = PNG.sync.read(fs.readFileSync(img1));
    let file2 = PNG.sync.read(fs.readFileSync(img2));

    if (file1.height !== file2.height) {
      const width = Math.max(file1.width, file2.width);
      const height = Math.max(file1.height, file2.height);
      file1 = await normalise(img1, width, height);
      file2 = await normalise(img2, width, height);
    }

    const data = await compareImages(file1, file2, opts);

    const filename = Date.now() + "_" + "result";
    const filepath = `images/${filename}.png`;
    await fs.writeFileSync(filepath, data.getBuffer());
    return filepath;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = getCompare;
