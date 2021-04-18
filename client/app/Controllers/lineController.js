let waitRepository = require("../Repositories/waitRepository");
let fsService = require("../Services/fsService");
let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
exports.sendTestRequest = function(line, request, socket) {
    // console.log("发送test包");
    let instrArr = line.split(" ");
    if(instrArr.length >= 2 && instrArr[0] == "/file" && instrArr[1] == "ignore") {
        let nowWait = waitRepository.getFirst();
        nowWait.delete;
        return null;
    }
    let nowWait = waitRepository.getFirst();
    request = requestWrapper.setRequestCovered(
        nowWait.request,
        "00",
        line,
        "text",
    );
    nowWait.delete();
    return request;
}
exports.sendMessageRequest = function(line, request, socket) {
    request = requestWrapper.setRequestCovered(
        request,
        "01",
        line,
        "text",
    );
    return request;
}
exports.sendInstructionRequest = function(line, request, socket) {
    let str = line.split(" ");
    switch (str[0]) {
        case "/name": {
            if(str.length != 2) {
                //错误处理
                request =  {error: "ERROR: Please use \"/name [YourName]\" to set your name!"};
            } else {
                request = requestWrapper.setRequestCovered(
                    request,
                    "00",
                    line,
                    "text",
                );
            }
            break;
        }
        case "/file": {
            //由于指令起名引起的误操作
            if(str[1] == "ignore" || str[1] == "receive") {
                request = {error: "Wrong File Name OR No File In The Receive List..."};
                return request;
            }
            let filepaths = line.split(" ")[1].split("/");
            let fileName = filepaths[filepaths.length - 1];
            let fsRes = fsService.readFileSync(str[1]);
            if(fsRes.error) {
                request = {error: fsRes.data};
            } else {
                request = requestWrapper.setRequestCovered(
                    request,
                    "01",
                    fsRes.data,
                    "file",
                    fileName,
                );
            }
            request.lineRespond = "SERVER: 发送成功！";
            break;
        }
        case "/record": {
            // console.log("发送voice包");
            // 在start部分，使用wait(fromClient = true)阻塞
            break;
        }
        case "/logout": {
            socket.end();
            break;
        }
        default: {
            //错误处理
            request = {error: "ERROR: Undefined Instruction"};
        }
    }
    return request;
}