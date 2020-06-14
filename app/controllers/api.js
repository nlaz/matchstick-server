const express = require("express");

const router = express.Router();

router.get("/images", function (req, res) {
  res.json({ hello: "world" });
});

module.exports = router;
