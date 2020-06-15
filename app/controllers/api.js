const express = require("express");
const config = require("../../config");
const capture = require("../utils/capture");
const compare = require("../utils/compare");

const router = express.Router();

const addBaseURL = (filepath) => `${config.serverURL}/${filepath}`;

router.get("/images", (req, res) => {
  res.json({ hello: "world" });
});

router.post("/images", async (req, res) => {
  const { input, output, options } = req.body;

  if (!input || !output) {
    return res.status(400).send("Invalid request");
  }

  try {
    // Capture websites
    const img1 = await capture(input, options);
    const img2 = await capture(output, options);
    // Compare images
    const result = await compare(img1, img2);

    // Respond with image urls
    return res.json({
      image1: addBaseURL(img1),
      image2: addBaseURL(img2),
      result: addBaseURL(result),
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;