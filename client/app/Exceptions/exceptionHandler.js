//TODO: 将错误发送到另外一个端口
let printError = function(error) {
    console.log("ERROR: " + error.message);
}
exports.printError = printError;