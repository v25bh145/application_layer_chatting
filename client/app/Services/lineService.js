let readline = require("readline");

let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
let errorHandler = require("../Exceptions/errorHandler");
let lineRouter = require("../../Router/lineRouter");
exports.run = function (socket) {
    let rl = readline.createInterface(process.stdin, process.stdout);
    rl.on("line", function (line) {
        let request = lineRouter.router(line, requestWrapper.initRequest(), socket);
        if(typeof request.error != "undefined" && request.error) {
            let error = errorHandler.form(request.error);
            error.printError();
        } else {
            //TODO delete debug
            console.log("发送请求")
            console.log(request);
            if(typeof request.lineRespond != "undefined") console.log(request.lineRespond);
            let chOl = requestWrapper.transRequestToChOl(request);
            socket.write(chOl);
        }
    });
};
