let waitModel = require("../Models/waitModel");
let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
let fsService = require("../Services/fsService");
let errorHandler = require("../Exceptions/errorHandler");
exports.s2cTest = function (respond, request) {
    // console.log(respond);
    let result = {};
    let instrHead = respond.body.split(" ");
    switch (instrHead[0]) {
        case "name-check": {
            //等待客户端输入后发送，卡输入
            result.error = false;
            result.isSendToServerWaiting = true;

            request = requestWrapper.setRequestNotCovered(
                request,
                "00",
                "name",
                "text",
            );

            //正则匹配
            //name [字母/数字/下划线]+
            let match = /\/name ([A-Z]|[0-9]|[a-z]|\_)+/g;
            let wait = waitModel.form(false, match, request);
            result.wait = wait;

            result.isPrinted = true;
            result.message = "Hello, please input your name and press enter!(use \"/name [YourName]\")";

            break;
        }
        case "file-check": {
            //等待客户端输入后发送，不卡输入
            result.error = false;
            result.isSendToServerWaiting = true;

            request = requestWrapper.setRequestNotCovered(
                request,
                "00",
                "file",
                "text",
            );

            let match = /file receive .*/g;
            let wait = waitModel.form(true, match, request);
            result.wait = wait;

            result.isPrinted = true;
            result.message =
                "SERVER: there is a file send by " +
                instrHead[1] +
                ", if you want receive this file, please use \"/file receive\" " +
                instrHead[2];
            break;
        }
        case "line-check": {
            //立即发送
            result.error = false;
            result.isSendToServerInstant = true;
            result.request = requestWrapper.setRequestCovered(request, "00", "/link-success", "text");
            result.isPrinted = false;
            break;
        }
        default: {
            result.error = errorHandler.form("Undefined Ch-Ol Instruction From Server");
        }
    }
    return result;
};
exports.s2cMessage = function (respond, request) {
    let result = {};
    switch (respond.headers["body-type"]) {
        case "voice":
            //TODO
            break;
        case "text":
            //向本端打印消息
            result.error = false;
            result.isPrinted = true;
            result.message = respond.body;
            break;
        case "file":
            result.error = false;
            result.isPrinted = false;
            result.message = "";
            fsService.writeFile(
                respond.headers["file-name"],
                respond.body,
                (err) => {
                    //错误处理
                    if (err) {
                        result.error = errorHandler.form(
                            "Write File Failed",
                        );
                    }
                },
            );
            break;
        default:
            //错误处理
            result.error = errorHandler.form(
                "Undefined File Type From Server",
            );
    }
    return result;
};
exports.noMethod = function (respond, request) {
    let result = {};
    //错误处理
    result.error = errorHandler.form(
        "Unsupported Operation From Server",
    );
    return result;
};
