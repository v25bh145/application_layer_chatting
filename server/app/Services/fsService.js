let fs = require("fs");
exports.writeFileSync = function (fileName, fileContent) {
    return fs.writeFileSync("./public/" + fileName, fileContent);
};
exports.readFileSync = function(fileName) {
    if(!fs.existsSync("./public/" + fileName)) return false;
    return fs.readFileSync("./public/" + fileName);
}
