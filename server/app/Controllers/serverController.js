let userRepository = require("../Repositories/userRepository");
let userModel = require("../Models/userModel");
let respondWrapper = require("../../serverChOlLib/RespondHandler/respondWrapper");
let fsService = require("../Services/fsService");
let Error = require("../Exceptions/errorHandler");
exports.c2sInstruction = function (request, respond, socket) {
    let instrHead = request.body.split(" ");
    switch (instrHead[0]) {
        case "/name": {
            let user = userModel.form(socket, instrHead[1]);
            if (typeof instrHead[1] == "undefined" || !user.save()) {
                //错误处理
                let error = Error.form(
                    "Illegal User Name",
                    true,
                    "Server: Illegal User Name",
                );
                return { error: error };
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
        case "/link-success": {
            //TODO
            break;
        }
        case "/file": {
            if (instrHead[1] == "receive") {
                let fileName = instrHead[2];
                if (fileName.split("/").length > 1) {
                    //错误处理
                    let error = Error.form(
                        "Illegal File Name",
                        true,
                        "Server: Illegal File Name",
                    );
                    return { error: error };
                }
                let fileContent = fsService.readFileSync(fileName);
                respond = respondWrapper.setRespond(
                    respond,
                    false,
                    "00",
                    "11",
                    fileContent,
                    userRepository.me(socket),
                    "file",
                    fileName,
                );
                break;
            }
        }
        default: {
            //错误处理
            //以11为方法，10为状态码发送
            let error = Error.form(
                "Unsupported Type Of Instruct",
                true,
                "Server: Unsupported Type Of Instruct",
            );
            return { error: error };
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
            let fileName = request.headers["file-name"];
            if (fileName.split("/").length > 1) {
                //错误处理
                let error = Error.form(
                    "Illegal File Name",
                    true,
                    "Server: Illegal File Name",
                );
                return { error: error };
            }
            let res = fsService.writeFileSync(fileName, request.body);
            if (res) {
                //错误处理
                let error = Error.form(
                    "File Write Error",
                    true,
                    "Server: File Write Error",
                );
                return { error: error };
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
            //错误处理
            //以11为方法，10为状态码发送
            let error = Error.form(
                "Unsupported Type Of Message",
                true,
                "Server: Unsupported Type Of Message",
            );
            return { error: error };
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
    //错误处理
    //以11为方法，10为状态码发送
    let error = Error.form(
        "Unsupported Type Of Operation",
        true,
        "Server: Unsupported Type Of Operation",
    );
    return { error: error };
};
