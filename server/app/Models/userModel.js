let tmpNum = 0;
class User {
    //组合模式
    repository = require("../Repositories/userRepository");
    id;
    socket;
    nickName;
    constructor(socket, nickName) {
        let that = this;
        that.id = tmpNum++;
        that.socket = socket;
        that.nickName = nickName;
    }
    //考虑到后面可能将数据存在缓存数据库中，因此设置成可以异步的方法。
    save(callback) {
        return this.repository.save(this, callback);
    }
    delete(callback) {
        return this.repository.delete(this, callback);
    }
}
exports.form = function(socket, nickName) {
    if (typeof nickName != "string") {
        //TODO: errorHandler
    }
    if (typeof socket != "object") {
        //TODO: errorHandler
    }
    return new User(socket, nickName);
}
