let userToName = [];
let userToIp = [];
let counts = 0;
exports.storeUser = function (nickName, ip, socket) {
    
    for(let otherUser in userToName)
        if(userToName[otherUser] == nickname) return false;

    userToName[socket] = nickName;
    userToIp[socket] = ip;

    counts++;
    return true;
}
exports.deleteUser = function(socket) {
    delete userToName[socket];
    delete userToIp[socket];
    counts--;
}
exports.getUserCounts = function() {
    return counts;
}
exports.getUserName = function (user) {
    if(typeof(userToName[user]) == "undefined") return false;
    else return userToName[user];
}
exports.me = function(user) {
    let userArray = [];
    userArray.push(user);
    return userArray;
}
exports.insteadOfMe = function(user) {
    let userArray = [];
    for(let otherUser in userToName) {
        if(otherUser != user) {
            userArray.push(otherUser);
        }
    }
    return userArray;
}