let idToSocket = [];
let idToName = [];
let counts = 0;
let ids = 0;
let findIdBySocket = function(socket) {
    for(let id in idToSocket)
        if(idToSocket[id] == socket) {
            return id;
        }
    return -1;
} 
exports.save = function (nickName, socket) {
    for(let id in idToName)
        if(idToName[id] == nickName) return false;

    idToSocket[ids] = socket;
    idToName[ids] = nickName;
    counts++;
    ids++;
    return true;
}
exports.delete = function(socket) {
    let id = findIdBySocket(socket);
    if(id == -1) return false;
    delete idToSocket[id];
    delete idToName[id];
    count--;
    return false;
}
exports.getCounts = function() {
    return counts;
}
exports.getUserName = function (socket) {
    let id = findIdBySocket(socket);
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
    let id = findIdBySocket(socket);
    for(let otherId in idToName)
        if(otherId != id) {
            socketArray.push(idToSocket[otherId]);
        } 
    return socketArray;
}