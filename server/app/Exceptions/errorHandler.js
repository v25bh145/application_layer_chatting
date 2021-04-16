let respondWrapper = require("../../serverChOlLib/RespondHandler/respondWrapper");
class Error {
    errorInfo;
    isBroadcastToClient;
    broadcastMessage;
    printError = function () {
        console.log("ERROR: " + this.errorInfo);
    };
    broadcast = function (socketArr) {
        let that = this;
        let respond = respondWrapper.setRespond(
            respondWrapper.initRespond(),
            true,
            "10",
            "11",
            that.errorInfo,
            socketArr,
            "text",
        );
        let chOl = respondWrapper.transRespondToChOl(respond);
        for(let i in socketArr) {
            // console.log(socketArr[i]);
            socketArr[i].write(chOl);
        }
    };
    constructor(errorInfo, isBroadcastToClient, broadcastMessage) {
        this.errorInfo = errorInfo;
        this.isBroadcastToClient = isBroadcastToClient;
        this.broadcastMessage = broadcastMessage;
    }
}

exports.form = function(errorInfo, isBroadcastToClient, broadcastMessage) {
    return new Error(errorInfo, isBroadcastToClient, broadcastMessage);
};
