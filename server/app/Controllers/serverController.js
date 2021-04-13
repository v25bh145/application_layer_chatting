let userRepository = require("../Repositories/userRepository");
let userModel = require("../Models/userModel");
let respondWrapper = require("../../serverChOlLib/RespondHandler/respondWrapper");
exports.c2sInstruction = function(request, respond, socket) {
    let instrHead = request.body.split(" ");
    switch(instrHead[0]) {
        case "name":
            let user = userModel.form(socket, instrHead[1])
            if(typeof(instrHead[1]) == "undefined" || !user.save()) {
                respond = respondWrapper.setRespond(respond, false, "11", "10", "name-check", userRepository.me(socket));
            } else {
                let welcome = "> welcome " + instrHead[1] + " !";
                respond = respondWrapper.setRespond(respond, false, "00", "11", welcome, userRepository.me(socket));
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
            respond = respondWrapper.setRespond(respond, true, "10", "11", errorInfo, userRepository.me(socket));
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
            respond = respondWrapper.setRespond(respond, false, "00", "11", userRepository.getUserBySocket(socket).nickName + ": " + request.body, userRepository.insteadOfMe(socket));
            break;
        case "file":
            //TODO
            break;
        default:
            //向客户端发送错误信息
            //以11为方法，10为状态码发送
            let errorInfo = "> unsupported type of message"
            respond = respondWrapper.setRespond(respond, true, "10", "11", errorInfo, userRepository.me(socket));
            break;
    }
    return respond;
}
exports.questName = function(request, respond, socket) {
    //向客户端发送指令
    //以10为方法，11为状态码发送
    respond = respondWrapper.setRespond(respond, false, "11", "10", "name-check", userRepository.me(socket));
    return respond;
}
exports.noMethod = function(request, respond, socket) {
    let errorInfo = "> unsupported operation"
    respond = respondWrapper.setRespond(respond, true, "10", "11", errorInfo, userRepository.me(socket));
    return respond;
}