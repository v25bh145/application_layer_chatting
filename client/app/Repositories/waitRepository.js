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
    if(head == 0) return waitQueue[MAX_WAIT - 1];
    else return waitQueue[head - 1];
};
exports.getCounts = function () {
    return count;
}
// exports.waitWrapper = function (request, match, canInputMessage) {
//     let wait = {};
//     wait.request = request;
//     //是否卡输入
//     wait.canInputMessage = canInputMessage;
//     //用户输入数据规范存到wait中
//     wait.match = match;
//     return wait;
// }
// exports.waitMessageCheck = function (message) {
//     //检查用户输入数据规范
//     let nowWait = exports.getWait();
//     if(message.match(nowWait.match) == null) return false;
//     else return true;
// }