let readline = require("readline");

let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
let waitRepository = require("../Repositories/waitRepository");

exports.run = function (socket) {
    let rl = readline.createInterface(process.stdin, process.stdout);
    rl.on("line", function (line) {
        let testFlag = waitRepository.isMessageTest(line);
        let request = "";

        if (testFlag) {
            //发送针对服务器test的请求包
            console.log("发送test包");
            let nowWait = waitRepository.getFirst();
            request = requestWrapper.setRequestCovered(
                nowWait.request,
                "00",
                line,
                "text",
            );
            nowWait.delete();
        } else {
            //检查内容，如果为指令则发送指令包，否则发送message包
            let str = line.split(" ");
            switch (str) {
                case "file": {
                    console.log("发送file包");

                    break;
                }
                case "voice": {
                    console.log("发送voice包");
                    break;
                }
                default: {
                    //初始化request对象
                    console.log("发送message包");
                    request = requestWrapper.initRequest();
                    request = requestWrapper.setRequestCovered(
                        request,
                        "01",
                        line,
                        "text",
                    );
                }
            }
        }
        console.log(request);
        let chOl = requestWrapper.transRequestToChOl(request);
        socket.write(chOl);
    });
};
