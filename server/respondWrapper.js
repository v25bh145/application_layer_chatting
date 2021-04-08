exports.initRespond = function() {
    let respond = {};
    respond.protocol = "ch-ol";
    respond.version = "0.0.1";
    return respond;
}
exports.setRespond = function(respond, status, method, send, sendTo, bodyType = undefined) {
    respond.status = status;
    respond.method = method;
    respond.send = send;
    respond.sendTo = sendTo;
    respond.bodyType = bodyType;
}
exports.transRespondToChOl = function(respond) {
    if(typeof(respond.method) == "undefined") return false;
    
    let chOl = "";
    chOl += respond.protocol + " " + respond.version + "\r\n";
    chOl += respond.method + "\r\n";
    chOl += respond.status + "\r\n";
    chOl += "header" + "\r\n";
    //respond have not header now
    if(typeof(respond.bodyType) != "undefined")
        chOl += "body-type " + respond.bodyType;
    chOl += "body" + "\r\n";
    chOl += respond.send + "\r\n";
    chOl += "end" + "\r\n";
    return chOl;
}