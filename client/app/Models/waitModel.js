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
    constructor(canInputMessage, match, request) {
        let that = this;
        that.canInputMessage = canInputMessage;
        that.match = match;
        that.request = request;
    };
    //考虑到后面可能将数据存在缓存数据库中，因此设置成可以异步的方法。
    save(callback) {
        return this.repository.save(this, callback);
    };
    delete(callback) {
        return this.repository.delete(this, callback);
    };
    //检查用户输入数据规范
    checkMessage(message) {
        let that = this;
        if(message.match(that.match) == null) return false;
        else return true;
    };
};
exports.form = function (canInputMessage, match, request) {
    console.log("DEBUG: " + typeof(match));
    if(typeof(canInputMessage) != "string") {
        //TODO: errorHandler
    }
    if(typeof(match) != "object") {
        //TODO: errorHandler
    }
    if(typeof(request) != "object") {
        //TODO: errorHandler
    }
    return new Wait(canInputMessage, match, request);
};