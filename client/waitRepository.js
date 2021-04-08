let MAX_WAIT = 20;
let waitQueue = [];
let head = 0, tail = 0;
let count = 0;
exports.setWait = function (request) { 
    if((head + 1) % MAX_WAIT == tail) return false;
    else {
        waitQueue[head] = request;
        head = (head + 1) % MAX_WAIT;
        count++;
    }
};
exports.getWait = function () { 
    if(head == 0) return waitQueue[MAX_WAIT - 1];
    else return waitQueue[head - 1];
};
exports.deleteWait = function () {
    if(tail == head) return false;
    waitQueue[tail] = undefined;
    tail = (tail + 1) % MAX_WAIT;
    count--;
};
exports.getWaitCount = function() {
    return count;
}