let serverReceiveController = require("../app/Controllers/serverReceiveController");
let errorHandler = require("../app/Exceptions/errorHandler");
let route = function (respond, request) {
    //中间件
    //错误处理
    if(respond.status == "server error") {
        return {error: errorHandler.form(respond.body)};
    } else if(respond.status == "net error") {
        return {error: errorHandler.form("Net Error")};
    }
    //路由主体
    switch (respond.method) {
        case "s2cTest":
            return serverReceiveController.s2cTest(respond, request);
        case "s2cMessage":
            return serverReceiveController.s2cMessage(respond, request);
        default:
            return serverReceiveController.noMethod(respond, request);
    }
};
exports.route = route;
