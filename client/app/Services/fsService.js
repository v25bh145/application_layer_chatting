let fs = require("fs");
exports.readFile = function (filePath, callback) {
    fs.stat(filePath, function(err, stat) {
        if(err) return callback(true, "Filepath Error");
        if(!stat.isFile) return callback(true, "Not A File");
        if(stat.size >= 50 * 1024 * 1024) return callback(true, "File Too Big");
        fs.readFile(filePath, function (err, data) {
            return callback(err, data);
        });
    })
};
exports.writeFile = function (fileName, fileContent, callback) {
    return fs.writeFile("./receive/" + fileName, fileContent, (err) => callback(err));
};
