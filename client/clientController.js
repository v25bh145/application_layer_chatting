let userRepository = require("./userRepository");
let respondWrapper = require("./respondWrapper");
exports.s2cTest = function(respond, request) {
    let result;
    let instrHead = request.body.slice(" ");
    switch(instrHead[0]) {
        case "name-check":
            result.error = false;
            result.isSendToServerWaiting = true;
            request = requestWrapper.setRequest(request, "00", "name", "");
            //TODO this way please!
            result.request = request;
            break;
        case "file-check":
            break;
        case "line-check":
            break;
        case "default":
            result.error = true;
            result.message = "undefined ch-ol instruction from server";
        // case "name":
        //     if(typeof(instrHead[1]) == "undefined" || !userRepository.storeUser(instrHead[1], socket)) {
        //         respond = respondWrapper.setRespond("11", "10", "name-check", userRepository.me(request.ip));
        //     } else {
        //         let welcome = "> name success, welcome " + instrHead[1] + " !";
        //         respond = respondWrapper.setRespond("00", "01", welcome, userRepository.me(request.ip));
        //     }
        //     break;
        // case "link-success":
        //     //TODO
        //     break;
        // case "file":
        //     //TODO
        //     break;
        // default:
        //     //向客户端发送错误信息
        //     //以11为方法，10为状态码发送
        //     let errorInfo = "> unsupported type of instruct";
        //     respond = respondWrapper.setRespond("10", "11", errorInfo, userRepository.me(request.ip));
        //     break;
    }
    return result;
}
exports.s2cMessage = function(respond, request) {
    switch(request.bodyType) {
        case "voice":
            //TODO
            break;
        case "text":
            //向本端打印消息
            
            break;
        case "file":
            //TODO
            break;
        default:
            //向客户端发送错误信息
            //以11为方法，10为状态码发送
            let errorInfo = "> unsupported type of message"
            respond = respondWrapper.setRespond("10", "11", errorInfo, userRepository.me(request.ip));
            break;
    }
    return respond;
}
exports.noMethod = function(respond, request) {
    result.error = true;
    result.message = "> unsupported operation from server";
    return result;
}