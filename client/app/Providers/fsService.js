let fs = require("fs");
exports.readFile = function(filePath, callback) {
    fs.readFile(filePath, function(err, data) {
        if(err) return false;
        else return callback(data);
    })
};
