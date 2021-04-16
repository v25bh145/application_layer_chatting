//心跳检测 TODO:
//在接收到来自该用户的其他请求后，更新heartTimerId
//在接收到来自该用户的line-success请求后，更新heartTimerId与waitTimerId
let respondWrapper = require("../../serverChOlLib/RespondHandler/respondWrapper");
let userRepository = require("../Repositories/userRepository");
let HEART_TIME = 60 * 1000;
let RESPOND_TIME = 10 * 1000;
let HEART_FUNC = function(user) {
    //发送给socket心跳检测包，在这里再设置一个定时器，如果在该定时器内收到包则reset timeId，取消该定时器，如果该定时器触发则删除该user
    respond = respondWrapper.setRespond(respondWrapper.initRespond(), false, "11", "10", "line-check", [user.socket], "text");
    let chOl = respondWrapper.transRespondToChOl(respond);
    user.socket.write(chOl);
    user.respondTimerId = setTimeout(() => {
        userRepository.delete(user);
    }, RESPOND_TIME);
};
exports.setHeartTimer = function(user) {
    user.heartTimerId = setTimeout(() => {HEART_FUNC(user)}, HEART_TIME);
    if(user.respondTimerId) {
        clearTimeout(user.respondTimerId);
        user.respondTimerId = null;
    }
};
exports.refreshHeartTimer = function(user) {
    clearTimeout(user.heartTimerId);
    if(user.respondTimerId) {
        clearTimeout(user.respondTimerId);
        user.respondTimerId = null;
    }
    user.heartTimerId = setTimeout(() => {HEART_FUNC(user)}, HEART_TIME);
};
exports.deleteHeartTimer = function(user) {
    if(user.respondTimerId) {
        clearTimeout(user.respondTimerId);
        user.respondTimerId = NULL;
    }
};
exports