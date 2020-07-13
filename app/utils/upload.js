const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const config = require("../../config");

//configuring the AWS environment
AWS.config.update({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
});

function encode(data) {
  let buf = Buffer.from(data);
  let base64 = buf.toString("base64");
  return base64;
}

const s3 = new AWS.S3();

//configuring parameters
const getParams = (filePath) => ({
  Bucket: "matchstick-assets",
  Body: fs.createReadStream(filePath),
  Key: "captures/" + Date.now() + "_" + path.basename(filePath),
  ContentEncoding: "base64",
  ContentType: "image/png",
  ACL: "public-read",
});

const uploadImage = async (filepath) => {
  try {
    const params = getParams(filepath);
    const data = await s3.upload(params).promise();
    return data;
  } catch (e) {
    console.log("Error", e);
  }
};

module.exports = uploadImage;
