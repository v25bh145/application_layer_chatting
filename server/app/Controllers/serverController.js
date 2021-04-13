let userRepository = require("../Repositories/userRepository");
let userModel = require("../Models/userModel");
let respondWrapper = require("../../serverChOlLib/RespondHandler/respondWrapper");
let fsService = require("../Services/fsService");
exports.c2sInstruction = function (request, respond, socket) {
    let instrHead = request.body.split(" ");
    switch (instrHead[0]) {
        case "name": {
            let user = userModel.form(socket, instrHead[1]);
            if (typeof instrHead[1] == "undefined" || !user.save()) {
                respond = respondWrapper.setRespond(
                    respond,
                    false,
                    "11",
                    "10",
                    "name-check",
                    userRepository.me(socket),
                );
            } else {
                let welcome = "> welcome " + instrHead[1] + " !";
                respond = respondWrapper.setRespond(
                    respond,
                    false,
                    "00",
                    "11",
                    welcome,
                    userRepository.me(socket),
                );
            }
            break;
        }
        case "link-success": {
            //TODO
            break;
        }
        case "file": {
            //TODO check fileName
            if (instrHead[1] == "receive") {
                let fileName = instrHead[2];
                let fileContent = fsService.readFileSync(fileName);
                respond = respondWrapper.setRespond(
                    respond,
                    false,
                    "00",
                    "11",
                    fileContent,
                    userRepository.me(socket),
                    "file",
                    fileName
                );
                break;
            }
        }
        default: {
            //向客户端发送错误信息
            //以11为方法，10为状态码发送
            let errorInfo = "> unsupported type of instruct";
            respond = respondWrapper.setRespond(
                respond,
                true,
                "10",
                "11",
                errorInfo,
                userRepository.me(socket),
            );
            break;
        }
    }
    return respond;
};
exports.c2sMessage = function (request, respond, socket) {
    switch (request.headers["body-type"]) {
        case "voice": {
            //TODO
            break;
        }
        case "text": {
            //向其他人发送广播
            respond = respondWrapper.setRespond(
                respond,
                false,
                "00",
                "11",
                userRepository.getUserBySocket(socket).nickName +
                    ": " +
                    request.body,
                userRepository.insteadOfMe(socket),
            );
            break;
        }
        case "file": {
            //TODO fileName check & file check
            let fileName = request.headers["file-name"];
            let res = fsService.writeFileSync(fileName, request.body);
            if (res) {
                //TODO: errorhandler
                console.log("ERR: " + "File Write Error");
            }
            respond = respondWrapper.setRespond(
                respond,
                false,
                "11",
                "10",
                "file-check " +
                    userRepository.getUserBySocket(socket).nickName +
                    " " +
                    fileName,
                userRepository.insteadOfMe(socket),
            );
            break;
        }
        default: {
            //向客户端发送错误信息
            //以11为方法，10为状态码发送
            let errorInfo = "> unsupported type of message";
            respond = respondWrapper.setRespond(
                respond,
                true,
                "10",
                "11",
                errorInfo,
                userRepository.me(socket),
            );
            break;
        }
    }
    return respond;
};
exports.questName = function (request, respond, socket) {
    //向客户端发送指令
    //以10为方法，11为状态码发送
    respond = respondWrapper.setRespond(
        respond,
        false,
        "11",
        "10",
        "name-check",
        userRepository.me(socket),
    );
    return respond;
};
exports.noMethod = function (request, respond, socket) {
    let errorInfo = "> unsupported operation";
    respond = respondWrapper.setRespond(
        respond,
        true,
        "10",
        "11",
        errorInfo,
        userRepository.me(socket),
    );
    return respond;
};
