let userArray = [];
let counts = 0;
let findIdBySocket = function(socket) {
    for(let id in userArray)
        if(userArray[id].socket == socket) {
            return id;
        }
    return -1;
} 
exports.save = function (user) {
    for(let id in userArray)
        if(userArray[id].nickName == user.nickName) return false;

    userArray[user.id] = user;
    counts++;
    return true;
}
exports.delete = function(user) {
    if(!user) return false;
    console.log(user.nickName + " 退出房间");
    delete userArray[user.id];
    counts--;
    return true;
}
exports.getCounts = function() {
    return counts;
}
exports.getUserBySocket = function (socket) {
    let id = findIdBySocket(socket);
    if(id == -1) return false;
    return userArray[id];
}
exports.me = function(socket) {
    let socketArray = [];
    socketArray.push(socket);
    return socketArray;
}
exports.insteadOfMe = function(socket) {
    let socketArray = [];
    let id = findIdBySocket(socket);
    for(let otherId in userArray)
        if(otherId != id) {
            socketArray.push(userArray[otherId].socket);
        } 
    return socketArray;
}