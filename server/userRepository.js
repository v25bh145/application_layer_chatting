let idToSocket = [];
let idToName = [];
let test;
let counts = 0;
let ids = 0;
let fineIdBySocket = function(socket) {
    for(let id in idToSocket)
        if(idToSocket[id] == socket) {
            return id;
        }
    return -1;
} 
exports.storeUser = function (nickName, socket) {
    for(let id in idToName)
        if(idToName[id] == nickName) return false;

    idToSocket[ids] = socket;
    idToName[ids] = nickName;
    counts++;
    ids++;
    return true;
}
exports.deleteUser = function(socket) {
    let id = fineIdBySocket(socket);
    if(id == -1) return false;
    delete idToSocket[id];
    delete idToName[id];
    count--;
    return false;
}
exports.getUserCounts = function() {
    return counts;
}
exports.getUserName = function (socket) {
    let id = fineIdBySocket(socket);
    if(id == -1) return false;
    return idToName[id];
}
exports.me = function(socket) {
    let socketArray = [];
    socketArray.push(socket);
    return socketArray;
}
exports.insteadOfMe = function(socket) {
    let socketArray = [];
    let id = fineIdBySocket(socket);
    for(let otherId in idToName)
        if(otherId != id) {
            socketArray.push(idToSocket[otherId]);
        } 
    return socketArray;
}