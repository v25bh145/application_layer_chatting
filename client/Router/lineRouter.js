let waitRepository = require("../app/Repositories/waitRepository");
let lineController = require("../app/Controllers/lineController");
/**
 * 
 * @param {String} line 
 * @param {Object} request 
 * @param {Object} socket 
 * @returns request
 */
exports.router = function (line, request, socket) {
    let testFlag = waitRepository.isMessageTest(line);
    //卡输入的回应格式不对
    if (typeof testFlag == "null") {
        //错误处理
        return {
            error: "ERROR: oops, please input the correct respond from server..."
        };
    }

    if (testFlag) {
        //发送针对服务器test的请求包
        return lineController.sendTestRequest(line, request, socket);
    } else if(line[0] == "/") {
        //发送针对服务器instruction的请求包
        return lineController.sendInstructionRequest(line, request, socket);
    } else {
        //发送针对服务器message的请求包
        return lineController.sendMessageRequest(line, request, socket);
    }
};
