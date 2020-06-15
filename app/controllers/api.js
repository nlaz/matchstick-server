const express = require("express");
const capture = require("../utils/capture");
const compare = require("../utils/compare");

const router = express.Router();

router.get("/images", (req, res) => {
  res.json({ hello: "world" });
});

router.post("/images", async (req, res) => {
  const { input, output } = req.query;

  if (!input || !output) {
    return res.status(400).send("Invalid request");
  }

  try {
    // Capture websites
    const img1 = await capture(input);
    const img2 = await capture(output);
    // Compare images
    const result = await compare(img1, img2);
    console.log("compare", result);

    // Respond with image urls
    return res.json({
      image1: img1,
      image2: img2,
      result: result,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
