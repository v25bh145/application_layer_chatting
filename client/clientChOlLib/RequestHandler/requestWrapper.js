const os = require("os");
///获取ip
function getIPAddress() {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}
exports.initRequest = function () {
    let request = {};
    request.protocol = "ch-ol";
    request.version = "0.0.1";
    request.host = getIPAddress();
    return request;
};
//client版本的setRequestNotCovered方法如果没有设置默认不覆盖原先数据
exports.setRequestNotCovered = function (request, method, send, bodyType) {
    if (typeof request.method == "undefined") request.method = method;
    if (typeof request.send == "undefined") request.send = send;
    if (typeof request.bodyType == "undefined") request.bodyType = bodyType;
    return request;
};
exports.setRequestCovered = function (request, method, send, bodyType, fileName) {
    request.method = method;
    request.send = send;
    request.bodyType = bodyType;
    if(typeof(fileName) != "undefined")
        request.fileName = fileName;
    return request;
};
exports.transRequestToChOl = function (request) {
    if (typeof request.method == "undefined") return false;

    let chOl = "";
    chOl += request.protocol + " " + request.version + "\r\n";
    chOl += request.method + "\r\n";
    chOl += "header" + "\r\n";
    //为指令时，默认为文字
    if (typeof request.bodyType == "undefined")
        chOl += "body-type " + "text" + "\r\n";
    else chOl += "body-type " + request.bodyType + "\r\n";
    chOl += "host " + request.host + "\r\n";
    if (typeof request.fileName != "undefined")
        chOl += "file-name " + request.fileName + "\r\n";
    chOl += "body " + request.send.length + "\r\n";
    chOl += request.send + "\r\n";
    console.log(chOl);
    return chOl;
};
