let fs = require("fs");
exports.writeFileSync = function (fileName, fileContent) {
    return fs.writeFileSync("./public/" + fileName, fileContent);
};
exports.readFileSync = function(fileName) {
    return fs.readFileSync("./public/" + fileName);
}
