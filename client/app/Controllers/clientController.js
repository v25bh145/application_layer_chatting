let waitModel = require("../Models/waitModel");
let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
exports.s2cTest = function (respond, request) {
    console.log(respond);
    let result = {};
    let instrHead = respond.body.split(" ");
    switch (instrHead[0]) {
        case "name-check":
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
            let match = /name ([A-Z]|[0-9]|[a-z]|\_)+/g;
            let wait = waitModel.form(false, match, request);
            result.wait = wait;

            result.isPrinted = true;
            result.message = "Hello, please input your name and press enter!";

            break;
        case "file-check":
            //等待客户端输入后发送，不卡输入
            break;
        case "line-check":
            //立即发送
            break;
        default:
            result.error = true;
            result.message = "undefined ch-ol instruction from server";
    }
    return result;
};
exports.s2cMessage = function (respond, request) {
    let result = {};
    switch (respond.bodyType) {
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
            //TODO
            break;
        default:
            result.error = true;
            result.message = "undefined file type from server";
    }
    return result;
};
exports.noMethod = function (respond, request) {
    let result = {};
    result.error = true;
    result.message = "> unsupported operation from server";
    return result;
};
