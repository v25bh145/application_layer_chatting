/**
 * 服务器的应用层报文处理
 */
let Mapper = require("./requestMapper");

exports.isFullChOl = function(chunk) {
    let array = [];
    array = chunk.slice("\r\n");
    if((array[0].splice(" "))[0] == "ch-ol" && array[array.length - 1] == "end") return true;
    else return false;
}

exports.parse = function(message) {
    //可扩展，通过在此添加Mapper组合即可实现过滤任何信息/转换信息的操作

    let mapper = Mapper.mapper(message);

    let protocolInfo = mapper.protocolInfoMapper();
    if(protocolInfo.error === true) return protocolInfo;

    let method = mapper.methodMapper();
    if(method.error === true) return method;

    let checkMethod = mapper.methodCheckServer(method);
    if(checkMethod.error == true) return checkMethod;

    let headers = mapper.headerMapper();
    if(headers.error === true) return headers;

    let checkHeader = mapper.headersCheckServer(headers);
    if(checkHeader.error == true) return checkHeader; 

    let body = mapper.bodyMapper();
    if(body.error == true) return body;
    
    return {error: false, message: {
        body: body.message,
        method: method.message,
        ip: headers.message["host"],
        bodyType: headers.message["body-type"]
    }};
}