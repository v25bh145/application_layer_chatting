/**
 * 服务器的应用层报文处理
 */
let Mapper = require("./requestMapper");

let requestParse = function(message) {
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

/**
 * TODO:
 * 1. bodyMapper
 * 2. serverController 
 */
    
    return {error: false, message: {
        body: body,
        method: method,
        ip: headers["host"],
        bodyType: headers["body-type"]
    }};
}
exports.parse = requestParse;