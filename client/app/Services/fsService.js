let fs = require("fs");
exports.readFileSync = function (filePath) {
    let stat = fs.statSync(filePath);
    if(!stat.isFile) return {error: true, data: "Not A File"};
    if(stat.size >= 50 * 1024 * 1024) return {error: true, data: "File Too Big"};
    let data = fs.readFileSync(filePath);
    return {error: false, data: data};
};
exports.writeFile = function (fileName, fileContent, callback) {
    return fs.writeFile("./receive/" + fileName, fileContent, (err) => callback(err));
};
