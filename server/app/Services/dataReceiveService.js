let requestParser = require("../../serverChOlLib/RequestHandler/requestParser");
let respondWrapper = require("../../serverChOlLib/RespondHandler/respondWrapper");
let errorHandler = require("../Exceptions/errorHandler");
let router = require("../../Router/router");
exports.run = function (socket) {
    //发现data事件在自己这里是一个字符一个字符输出的，所以就做了个存储
    let data = "";
    socket.on("data", function (chunk) {
        if (requestParser.isFullChOl(chunk)) {
            //初始化respond对象
            let respond = respondWrapper.initRespond();
            //将ch-ol转换为request对象
            let requestWrapped = requestParser.parse(chunk);
            if (requestWrapped.error == true)
                errorHandler.printError(requestWrapped);
            else {
                //路由器，后转控制器
                let request = requestWrapped.message;
                console.log("接收到包");
                console.log(request);
                respond = router.route(request, respond, socket);
                console.log("发送响应");
                console.log(respond);
                if (respond.error == true) errorHandler.printError(respond);
                else {
                    //将respond对象转换为ch-ol
                    let chOl = respondWrapper.transRespondToChOl(respond);
                    //如果需要发包，即发包给客户端
                    if (chOl)
                        for (let index in respond.sendTo)
                            respond.sendTo[index].write(chOl);
                }
            }
            data = "";
        } else {
            data += chunk;
        }
    });
};
