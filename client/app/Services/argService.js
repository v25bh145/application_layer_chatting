let lineRouter = require("../../Router/lineRouter");
let errorHandler = require("../Exceptions/errorHandler");
let requestWrapper = require("../../clientChOlLib/RequestHandler/requestWrapper");
let sendNamePack = false;
exports.runBeforeConnect = function () {
    global.DEBUG_MODE = false;
    global.ip = null;
    global.port = null;
    for (let i = 2; i < process.argv.length; i++) {
        switch (process.argv[i]) {
            case "-port":
            case "-p": {
                //后面无参数或参数带'-'，则报错
                if (
                    i == process.argv.length - 1 ||
                    process.argv[i + 1][0] == "-"
                ) {
                    console.log("参数错误: -port <port>");
                    console.log("请使用 --help 查看程序说明")
                    process.exit();
                } else {
                    global.port = process.argv[++i];
                }
                break;
            }
            case "-ip": {
                //后面无参数或参数带'-'，则报错
                if (
                    i == process.argv.length - 1 ||
                    process.argv[i + 1][0] == "-"
                ) {
                    console.log("参数错误: -ip <ip>");
                    console.log("请使用 --help 查看程序说明")
                    process.exit();
                } else {
                    global.ip = process.argv[++i];
                }
                break;
            }
            case "--debug": {
                global.DEBUG_MODE = true;
                break;
            }
            case "-name": {
                //后面无参数或参数带'-'，则报错
                if (
                    i == process.argv.length - 1 ||
                    process.argv[i + 1][0] == "-"
                ) {
                    console.log("参数错误: -name <user-name>");
                    console.log("请使用 --help 查看程序说明")
                    process.exit();
                } else {
                    sendNamePack = true;
                }
                break;
            }
            case "--help": {
                console.log("========程序说明========");
                console.log("本程序是一个基于自设计的应用层协议ch-ol开发的基于TCP的网络聊天应用");
                console.log("支持聊天，改名，文件上传、下载功能，更多功能敬请期待...");
                console.log("========指令说明========");
                console.log("运行参数:");
                console.log("-ip 指定服务器ip地址，必须参数");
                console.log("-p(-port) 指定服务器端口号，必须参数");
                console.log("-name [user-name]以[user-name]登入服务器");
                console.log("--debug 调试模式");
                console.log("--help 查看帮助");
                console.log("聊天指令");
                console.log("/file [filepath] 发送文件给其他人，其他人可以选择接受可以忽略");
                console.log("/file receive <file-name> 接受当前文件");
                console.log("/file ignore 忽略当前文件");
                console.log("/logout 登出");
                console.log("/name 命名或重新命名");
                console.log("========================")
                process.exit();
            }
            default: {
                console.log("参数错误: 未知启动参数 " + process.argv[i]);
                process.exit();
            }
        }
    }
    if (global.port == null || global.ip == null) {
        console.log("参数缺失: 请指定服务器ip与端口号 -ip <ip> -port <port>");
        console.log("请使用 --help 查看程序说明")
        process.exit();
    }
};
exports.runAfterConnect = function (socket) {
    if (sendNamePack) {
        //发送姓名包(耦合了一段内容，不过问题不是很大)
        let request = lineRouter.router(
            "/name " + process.argv[++i],
            requestWrapper.initRequest(),
            socket,
        );
        if (typeof request.error != "undefined" && request.error) {
            let error = errorHandler.form(request.error);
            error.printError();
        } else {
            if (typeof request.lineRespond != "undefined")
                console.log(request.lineRespond);
            let chOl = requestWrapper.transRequestToChOl(request);
            if (global.DEBUG_MODE) {
                console.log("发送包");
                console.log(chOl);
            }
            socket.write(chOl);
        }
    }
};
