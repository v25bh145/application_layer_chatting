let readline = require("readline");

let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
let errorHandler = require("../Exceptions/errorHandler");
let lineRouter = require("../../Router/lineRouter");
exports.run = function (socket) {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ""
      });
    rl.on("line", function (line) {
        if(line == "") return;
        let request = lineRouter.router(line, requestWrapper.initRequest(), socket);
        if(request == null) return;
        if(typeof request.error != "undefined" && typeof request.error == "string") {
            let error = errorHandler.form(request.error);
            error.printError();
        } else {
            if(typeof request.lineRespond != "undefined") console.log(request.lineRespond);
            let chOl = requestWrapper.transRequestToChOl(request);
            if(global.DEBUG_MODE) {
                console.log("发送包")
                console.log(chOl);
            }
            socket.write(chOl);
        }
    });
};
