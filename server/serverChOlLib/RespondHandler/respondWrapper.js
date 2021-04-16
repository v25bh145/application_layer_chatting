exports.initRespond = function () {
    let respond = {};
    respond.protocol = "ch-ol";
    respond.version = "0.0.1";
    return respond;
};
exports.setRespond = function (
    respond,
    error,
    status,
    method,
    send,
    sendTo,
    bodyType,
    fileName,
) {
    respond.status = status;
    respond.error = error;
    respond.method = method;
    respond.send = send;
    respond.sendTo = sendTo;
    respond.bodyType = bodyType;
    respond.fileName = fileName;
    return respond;
};
exports.transRespondToChOl = function (respond) {
    if (typeof respond.method == "undefined") return false;

    let chOl = "";
    chOl += respond.protocol + " " + respond.version + "\n";
    chOl += respond.method + "\n";
    chOl += respond.status + "\n";
    chOl += "header" + "\n";
    //为指令时，默认为文字
    if (typeof respond.bodyType == "undefined")
        chOl += "body-type " + "text" + "\n";
    else chOl += "body-type " + respond.bodyType + "\n";
    if (typeof respond.fileName != "undefined")
        chOl += "file-name " + respond.fileName + "\n";
    chOl += "body " + respond.send.length + "\n";
    chOl += respond.send + "\n";
    return chOl;
};
