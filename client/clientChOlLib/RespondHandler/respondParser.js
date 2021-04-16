/**
 * 客户端的应用层报文处理
 */
let Mapper = require("./respondMapper");

exports.isFullChOl = function (chunk) {
    let array = [];
    array = chunk.split("\n");
    if (array[0].split(" ")[0] == "ch-ol")
        return true;
    else return false;
};

exports.parse = function (message) {
    //可扩展，通过在此添加Mapper组合即可实现过滤任何信息/转换信息的操作

    let mapper = Mapper.mapper(message);

    let protocolInfo = mapper.protocolInfoMapper();
    if (protocolInfo.error === true) return protocolInfo;

    let method = mapper.methodMapper();
    if (method.error === true) return method;

    let checkMethod = mapper.methodCheckServer(method);
    if (checkMethod.error == true) return checkMethod;

    let status = mapper.statusMapper();
    if (status.error === true) return status;

    let headers = mapper.headerMapper();
    if (headers.error === true) return headers;

    let checkHeader = mapper.headersCheckServer(headers);
    if (checkHeader.error == true) return checkHeader;

    let body = mapper.bodyMapper();
    if (body.error == true) return body;

    return {
        error: false,
        message: {
            body: body.message,
            status: status.message,
            method: method.message,
            headers: headers.message,
        },
    };
};
