let lineRouter = require("../../Router/lineRouter");
let errorHandler = require("../Exceptions/errorHandler");
let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
exports.run = function(socket) {
    global.DEBUG_MODE = false;
    for(let i = 2; i < process.argv.length; i++) {
        switch(process.argv[i]) {
            case "--debug": {
                global.DEBUG_MODE = true;
                break;
            }
            case "-name": {
                //后面无参数或参数带'-'，则报错
                if(i == process.argv.length - 1 || process.argv[i + 1][0] == "-") {
                    console.log("参数错误: -name <user-name>");
                    process.exit();
                } else {
                    //发送姓名包(耦合了一段内容，不过问题不是很大)
                    let request = lineRouter.router("/name " + process.argv[++i], requestWrapper.initRequest(), socket);
                    if(typeof request.error != "undefined" && request.error) {
                        let error = errorHandler.form(request.error);
                        error.printError();
                    } else {
                        if(typeof request.lineRespond != "undefined") console.log(request.lineRespond);
                        let chOl = requestWrapper.transRequestToChOl(request);
                        if(global.DEBUG_MODE) {
                            console.log("发送包");
                            console.log(chOl);
                        }
                        socket.write(chOl);
                    }
                }
                break;
            }
            default: {
                console.log("参数错误: 未知启动参数 " + process.argv[i]);
                process.exit();
            }
        }
    }
}