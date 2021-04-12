let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
let respondParser = require("../../clientChOlLib/RespondHandler/respondParser");
let errorHandler = require("../Exceptions/exceptionHandler");
let router = require("../../Router/router");

let data = "";
exports.run = function (socket) {
    socket.addListener("data", function (chunk) {
        if (respondParser.isFullChOl(chunk)) {
            //初始化request对象
            let request = requestWrapper.initRequest();
            //将ch-ol转换为respond对象
            let respondWrapped = respondParser.parse(chunk);
            if (respondWrapped.error == true)
                errorHandler.printError(respondWrapped);
            else {
                let respond = respondWrapped.message;
                console.log("接收到响应");
                console.log(respond);
                //路由器，后转控制器
                result = router.route(respond, request);
                console.log("产生结果");
                console.log(result);
                if (typeof result.error != "undefined" && result.error == true)
                    errorHandler.printError(result);
                else {
                    if (
                        typeof result.isSendToServerInstant != "undefined" &&
                        result.isSendToServerInstant
                    ) {
                        let chOl = requestWrapper.transRequestToChOl(
                            result.request,
                        );
                        socket.write(chOl);
                    } else if (
                        typeof result.isSendToServerWaiting != "undefined" &&
                        result.isSendToServerWaiting
                    ) {
                        //将result.request包装为wait对象存在缓存中
                        result.wait.save();
                    }
                    if (
                        typeof result.isPrinted != "undefined" &&
                        result.isPrinted
                    ) {
                        console.log(result.message);
                    }
                }
            }
            data = "";
        } else {
            data += chunk;
        }
    });
};
