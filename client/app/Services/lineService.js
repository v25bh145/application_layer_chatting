let readline = require("readline");

let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
let waitRepository = require("../Repositories/waitRepository");
let fsService = require("./fsService");
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
            let chOl = requestWrapper.transRequestToChOl(request);
            socket.write(chOl);
        } else {
            //检查内容，如果为指令则发送指令包，否则发送message包
            let str = line.split(" ");
            switch (str[0]) {
                case "name": {
                    let request = requestWrapper.initRequest();
                    request = requestWrapper.setRequestCovered(
                        request,
                        "00",
                        line,
                        "text"
                    );
                    let chOl = requestWrapper.transRequestToChOl(request);
                    console.log(chOl);
                    socket.write(chOl);
                    break;
                }
                case "file": {
                    let filepaths = line.split(" ")[1].split("/");
                    let fileName = filepaths[filepaths.length - 1];
                    fsService.readFile(str[1], function(err, res) {
                        if(err) {
                            //ERRORHANDLER
                            console.log("ERROR: please check filepath");
                            return;  
                        } else {
                            let request = requestWrapper.initRequest();
                            request = requestWrapper.setRequestCovered(
                                request,
                                "01",
                                res,
                                "file",
                                fileName
                            );
                            let chOl = requestWrapper.transRequestToChOl(request);
                            console.log(chOl);
                            socket.write(chOl);
                        }
                    });
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
                    let chOl = requestWrapper.transRequestToChOl(request);
                    socket.write(chOl);
                }
            }
        }
    });
};
