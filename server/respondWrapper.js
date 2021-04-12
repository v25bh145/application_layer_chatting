exports.initRespond = function() {
    let respond = {};
    respond.protocol = "ch-ol";
    respond.version = "0.0.1";
    return respond;
}
exports.setRespond = function(respond, error, status, method, send, sendTo, bodyType = "text") {
    respond.status = status;
    respond.error = error;
    respond.method = method;
    respond.send = send;
    respond.sendTo = sendTo;
    respond.bodyType = bodyType;
    return respond;
}
exports.transRespondToChOl = function(respond) {
    if(typeof(respond.method) == "undefined") return false;
    
    let chOl = "";
    chOl += respond.protocol + " " + respond.version + "\r\n";
    chOl += respond.method + "\r\n";
    chOl += respond.status + "\r\n";
    chOl += "header" + "\r\n";
    //为指令时，默认为文字
    if(typeof(respond.bodyType) == "undefined")
        chOl += "body-type " + "text" + "\r\n";
    else
        chOl += "body-type " + respond.bodyType + "\r\n";
    chOl += "body" + "\r\n";
    chOl += respond.send + "\r\n";
    chOl += "end";
    return chOl;
}