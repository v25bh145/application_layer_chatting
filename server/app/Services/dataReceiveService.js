let requestParser = require("../../serverChOlLib/RequestHandler/requestParser");
let respondWrapper = require("../../serverChOlLib/RespondHandler/respondWrapper");
let errorHandler = require("../Exceptions/errorHandler");
let userRepository = require("../Repositories/userRepository");
let router = require("../../Router/router");
exports.run = function (socket) {
    //发现data事件在自己这里是一个字符一个字符输出的，所以就做了个存储
    let data = "";
    socket.on("data", function (chunk) {
        if (requestParser.isFullChOl(chunk)) {
            if(global.DEBUG_MODE) {
                console.log("接收包");
                console.log(chunk);
            }
            //初始化respond对象
            let respond = respondWrapper.initRespond();
            //将ch-ol转换为request对象
            let requestWrapped = requestParser.parse(chunk);
            if (requestWrapped.error == true) {
                let error = errorHandler.form(
                    requestWrapped.message,
                    false,
                    "",
                );
                error.printError();
            } else {
                //路由器，后转控制器
                let request = requestWrapped.message;
                respond = router.route(request, respond, socket);
                //错误处理
                if (respond.error) {
                    respond.error.printError();
                    respond.error.broadcast(userRepository.me(socket));
                } else if (
                    typeof respond.notSendToClient == "undefined" ||
                    !respond.notSendToClient
                ) {
                    //将respond对象转换为ch-ol
                    let chOl = respondWrapper.transRespondToChOl(respond);
                    //如果需要发包，即发包给客户端
                    if (chOl) {
                        for (let index in respond.sendTo)
                            respond.sendTo[index].write(chOl);
                            if(global.DEBUG_MODE) {
                                console.log("发送包");
                                console.log(chOl);
                            }
                    }
                }
            }
            data = "";
        } else {
            data += chunk;
        }
    });
};
