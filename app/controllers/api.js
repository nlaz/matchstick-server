const express = require("express");
const formidable = require("formidable");
const path = require("path");
const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("fs"));
const config = require("../../config");
const capture = require("../utils/capture");
const compare = require("../utils/compare");
const upload = require("../utils/upload");
const hexRgb = require("hex-rgb");

const router = express.Router();

const addBaseURL = (filepath) => `${config.serverURL}/${filepath}`;

const formatOptions = (options) => {
  return JSON.parse(options);
};

const formatColor = (color) => {
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    const { red, green, blue } = hexRgb(color);
    return { red, green, blue };
  }
};

const checkUploadsFolder = async (uploadFolder) => {
  try {
    await fs.statAsync(uploadFolder);
  } catch (e) {
    if (e && e.code == "ENOENT") {
      try {
        await fs.mkdirAsync(uploadFolder);
      } catch (e) {
        console.error("Error creating the uploads folder");
        return false;
      }
    } else {
      console.error("Error reading the uploads folder");
      return false;
    }
  }
  return true;
};

const checkFileType = (file) => {
  const type = file.type.split("/").pop();
  const validTypes = ["png"];
  if (!validTypes.includes(type)) {
    return false;
  }
  return true;
};

const parameterize = (name) => encodeURIComponent(name.replace(/&. *;+/g, "_"));

router.get("/images", (req, res) => {
  res.json({ hello: "world" });
});

router.post("/comparison", async (req, res) => {
  let img1, img2, result;
  const maxFileSize = 50 * 1024 * 1024; // 50 MB
  const uploadDir = path.join(__dirname, "..", "..", "images");

  const form = formidable({ maxFileSize, uploadDir });
  const folderExists = await checkUploadsFolder(uploadDir);

  if (!folderExists) {
    console.error("Uploads folder does not exists.");
    return res.status(500).send("Could not upload file.");
  }

  form.parse(req, async (error, fields, files) => {
    if (error) {
      console.error("Error parsing the files");
      return res.json({ ok: false, msg: "Error parsing the files" });
    }
    if (!checkFileType(files.upload)) {
      console.error("The file type is invalid");
      return res.status(400).send("Unsupported file type");
    }

    const { url, options } = fields;
    const opts = formatOptions(options);
    const file = files.upload;
    const filename = Date.now() + "_" + parameterize(file.name);

    // Step 1 - Upload and rename file
    try {
      await fs.renameAsync(file.path, path.join(form.uploadDir, filename));
      img2 = path.join("images", filename);
    } catch (e) {
      console.log("The file upload failed, trying to remove the temp file...");
      await fs.unlinkAsync(file.path);
      return res.status(500).send("Could not upload file.");
    }

    // Step 2 - Capture screenshot from URL
    try {
      img1 = await capture(url, opts);
    } catch (e) {
      console.error("Error capturing screenshot", e);
      return res.status(500).send("Could not capture screenshot.");
    }

    // Step 3 - Compare results
    try {
      const errorColor = formatColor(opts.color);
      const { width, height } = opts;
      result = await compare(img1, img2, { width, height, errorColor });
    } catch (e) {
      console.error("Error comparing results");
      return res.status(500).send("Could not compare results.");
    }

    // Step 4 - Upload images
    try {
      img1 = await upload(img1);
      img2 = await upload(img2);
      result = await upload(result);
    } catch (e) {
      console.error("Error uploading results");
      return res.status(500).send("Could not upload results.");
    }

    return res.json({
      image1: img1.Location,
      image2: img2.Location,
      result: result.Location,
    });
  });
});

module.exports = router;
