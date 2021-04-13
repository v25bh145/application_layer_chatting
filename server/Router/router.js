let serverController = require("../app/Controllers/serverController");
let userRepository = require("../app/Repositories/userRepository");
let route = function(request, respond, socket) {
    //中间件
    //查询ip是否有起名
    if((request.method != "c2sInstruction" || request.body.split(" ")[0] != "name") && !userRepository.getUserBySocket(socket).nickName) {
        //没有起名，发送起名询问
        return serverController.questName(request, respond, socket);
    } else {
        //路由主体
        switch (request.method) {
            case "c2sInstruction":
                return serverController.c2sInstruction(request, respond, socket);
            case "c2sMessage":
                return serverController.c2sMessage(request, respond, socket);
            default :
                return serverController.noMethod(request, respond, socket);
        }
    }
}
exports.route = route;