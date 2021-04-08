let ipsToNames = [];
let ipsToUsers = [];
let counts = 0;
exports.storeUser = function (nickName, ip, socket) {
    for(let otherIp in ipsToNames)
        if(ipsToNames[otherIp] == nickname) return false;

    ipsToNames[ip] = nickName;
    ipsToUsers[ip] = socket;
    counts++;
    return true;
}
exports.deleteUser = function(ip) {
    delete ipsToNames[ip];
    delete ipsToUsers[ip];
    counts--;
}
exports.deleteUserBySocket = function(socket) {
    for(let ip in ipsToUsers)
        if(ipsToUsers[ip] == socket) {
            delete ipsToUsers[ip];
            delete ipsToNames[ip];
            counts--;
            break;
        }
}
exports.getUserCounts = function() {
    return counts;
}
exports.checkIp = function (ip) {
    if(typeof(ipsToNames[ip]) == "undefined") return false;
    else return ipsToNames[ip];
}
exports.me = function(ip) {
    let userArray = [];
    for(let otherIps in ipsToUsers) {
        if(otherIps == ip) {
            userArray.push(ipsToUsers[otherIps]);
            break;
        }
    }
    return userArray;
}
exports.insteadOfMe = function(ip) {
    let userArray = [];
    for(let otherIps in ipsToUsers) {
        if(otherIps != ip) {
            userArray.push(ipsToUsers[otherIps]);
        }
    }
    return userArray;
}