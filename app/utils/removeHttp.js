module.exports = (url) => {
  if (typeof url !== "string") {
    throw new TypeError(
      `Expected \`url\` to be of type \`string\`, got \`${typeof url}\``
    );
  }
  return url.replace(/^https?:\/\//, "");
};
