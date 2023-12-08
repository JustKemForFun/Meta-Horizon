let data = {};
function setFont(font) {
  data["font"] = font;
  console.log(font)
}
function getFont() {
  return data["font"];
}
module.exports = { setFont, getFont };
