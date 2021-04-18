let fs = require("fs");
exports.readFileSync = function (filePath) {
    if (!fs.existsSync(filePath))
        return { error: true, data: "File Not Exists" };
    let stat = fs.statSync(filePath);
    if (!stat.isFile) return { error: true, data: "Not A File" };
    if (stat.size >= 63 * 1024) return { error: true, data: "File Too Big" };
    let data = fs.readFileSync(filePath);
    return { error: false, data: data };
};
exports.writeFile = function (fileName, fileContent, callback) {
    if (!fs.existsSync("./receive/")) fs.mkdirSync("./receive/");
    return fs.writeFile("./receive/" + fileName, fileContent, (err) =>
        callback(err),
    );
};
