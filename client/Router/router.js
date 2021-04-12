let clientController = require("../app/Controllers/clientController");
let route = function(respond, request) {
    //中间件

    //路由主体
    switch (respond.method) {
        case "s2cTest":
            return clientController.s2cTest(respond, request);
        case "s2cMessage":
            return clientController.s2cMessage(respond, request);
        default :
            return clientController.noMethod(respond, request);
    }

}
exports.route = route;