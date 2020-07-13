const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  secretKey: process.env.SECRET_KEY || "octocat",
  serverURL: process.env.SERVER_URL || "http://localhost:5000",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};
