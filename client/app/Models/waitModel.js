//wait字段:
/**
 * 1. canInputMessage 是否阻塞用户发送消息
 * 2. match 限制用户发送消息的正则表达式
 * 3. request wait等待的请求
 */
class Wait {
    //组合模式嵌入
    repository = require("../Repositories/waitRepository");
    canInputMessage;
    match;
    request;
    fromClient;
    constructor(canInputMessage, match, request, fromClient) {
        let that = this;
        that.canInputMessage = canInputMessage;
        that.match = match;
        that.request = request;
        if(typeof fromClient == "undefined") that.fromClient = false;
        else that.fromClient = fromClient;
    }
    //考虑到后面可能将数据存在缓存数据库中，因此设置成可以异步的方法。
    save(callback) {
        return this.repository.save(this, callback);
    }
    delete(callback) {
        return this.repository.delete(this, callback);
    }
}
exports.form = function (canInputMessage, match, request) {
    return new Wait(canInputMessage, match, request);
};
