exports.initRequest = function() {
    let request = {};
    request.protocol = "ch-ol";
    request.version = "0.0.1";
    return request;
}
//client版本的setRequest方法如果没有设置默认不覆盖原先数据
exports.setRequest = function(request, method, send, bodyType = undefined) {
    if(typeof(request.method) != "undefined")
        request.method = method;
    if(typeof(request.send) != "undefined")
        request.send = send;
    if(typeof(request.bodyType) != "undefined")
        request.bodyType = bodyType;
}
exports.transRequestToChOl = function(request) {
    if(typeof(request.method) == "undefined") return false;
    
    let chOl = "";
    chOl += request.protocol + " " + request.version + "\r\n";
    chOl += request.method + "\r\n";
    chOl += "header" + "\r\n";
    //为指令时，默认为文字
    if(typeof(request.bodyType) == "undefined")
        chOl += "body-type " + "text" + "\r\n";
    else
        chOl += "body-type " + request.bodyType + "\r\n";
    chOl += "body" + "\r\n";
    chOl += request.send + "\r\n";
    chOl += "end" + "\r\n";
    return chOl;
}