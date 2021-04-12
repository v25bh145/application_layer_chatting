let MAX_WAIT = 20;
let waitQueue = [];
let head = 0, tail = 0;
let count = 0;
exports.save = function (wait) { 
    if((head + 1) % MAX_WAIT == tail) return false;
    else {
        waitQueue[head] = wait;
        head = (head + 1) % MAX_WAIT;
        count++;
    }
};
exports.delete = function () {
    if(tail == head) return false;
    waitQueue[tail] = undefined;
    tail = (tail + 1) % MAX_WAIT;
    count--;
};
exports.getFirst = function () { 
    if(tail == head) return false;
    if(head == 0) return waitQueue[MAX_WAIT - 1];
    else return waitQueue[head - 1];
};
exports.getCounts = function () {
    return count;
}
//检查用户输入数据规范
exports.checkMessage = function(message) {
    let wait = exports.getFirst();
    if(!wait) return false;
    if(message.match(wait.match) == null) return false;
    else return true;
};
exports.isMessageTest = function(message) {
    let wait = exports.getFirst();
    if(!wait) return false;
    //用户输入的数据是否符合请求规定的规范
    if(exports.checkMessage(message)) {
        return true;
    }
    if(wait.canInputMessage) {
        //发送message/instruction包
        return false;
    } else {
        //TODO: 报错，重来
        console.log("error> oops, please input the correct respond from server...");
        return undefined;
    }
};