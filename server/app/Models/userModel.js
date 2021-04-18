let tmpNum = 0;
class User {
    //组合模式
    repository = require("../Repositories/userRepository");
    id;
    socket;
    nickName;
    heartTimerId;
    respondTimerId;
    inline;
    constructor(socket, nickName) {
        let that = this;
        that.id = tmpNum++;
        that.socket = socket;
        that.nickName = nickName;
        that.respondTimerId = null;
        that.inline = true;
    }
    //考虑到后面可能将数据存在缓存数据库中，因此设置成可以异步的方法。
    save(callback) {
        let that = this;
        that.inline = true;
        if (typeof that.nickName != "string" || typeof that.socket != "object")
            return false;
        return that.repository.save(this, callback);
    }
    delete(callback) {
        let that = this;
        if (that.inline) {
            that.inline = false;
            return this.repository.delete(this, callback);
        } else return false;
    }
}
exports.form = function (socket, nickName) {
    return new User(socket, nickName);
};
