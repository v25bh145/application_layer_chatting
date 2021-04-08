let userRepository = require("./userRepository");
let respondWrapper = require("./respondWrapper");
exports.c2sInstruction = function(request, respond, socket) {
    let instrHead = request.body.slice(" ");
    switch(instrHead[0]) {
        case "name":
            if(typeof(instrHead[1]) == "undefined" || !userRepository.storeUser(instrHead[1], socket)) {
                respond = respondWrapper.setRespond("11", "10", "name-check", userRepository.me(request.ip));
            } else {
                let welcome = "> name success, welcome " + instrHead[1] + " !";
                respond = respondWrapper.setRespond("00", "01", welcome, userRepository.me(request.ip));
            }
            break;
        case "link-success":
            //TODO
            break;
        case "file":
            //TODO
            break;
        default:
            //向客户端发送错误信息
            //以11为方法，10为状态码发送
            let errorInfo = "> unsupported type of instruct";
            respond = respondWrapper.setRespond("10", "11", errorInfo, userRepository.me(request.ip));
            break;
    }
    return respond;
}
exports.c2sMessage = function(request, respond, socket) {
    switch(request.bodyType) {
        case "voice":
            //TODO
            break;
        case "text":
            //向其他人发送广播
            respond = respondWrapper.setRespond("00", "01", request.body, userRepository.insteadOfMe(request.ip));
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
exports.questName = function(request, respond, socket) {
    //向客户端发送指令
    //以10为方法，11为状态码发送
    respond = respondWrapper.setRespond("11", "10", "name-check", userRepository.me(request.ip));
    return respond;
}
exports.noMethod = function(request, respond, socket) {
    let errorInfo = "> unsupported operation"
    respond = respondWrapper.setRespond("10", "11", errorInfo, userRepository.me(request.ip));
    return respond;
}