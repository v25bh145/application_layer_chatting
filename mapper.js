class Mapper {
    _segments = [];
    _cols = 0;
    constructor(message = "") {
        let that = this;
        that._segments = message.split("\n");
        that._cols = 0;
    }
    protocolInfoMapper = () => {
        //读取协议信息
        let that = this;
        let protocolInfo = that._segments[that._cols++].split(" ");
        if(protocolInfo.length != 2) return {error: true, message: "undefined message type in cols:" +that._cols};
        //可封装/扩展
        if(protocolInfo[0] !== "ch-ol") return {error: true, message: "undefined protocol in cols:" +that._cols};
        if(protocolInfo[1] !== "0.0.1") return {error: true, message: "undefined version of " + that._segments[0] + " in cols:" +that._cols};
        return {error: false, message: {
            name: protocolInfo[0],
            version: protocolInfo[1]
        }};
    }
    methodMapper = () => {
        //读取方法信息
        let that = this;
        let method = that._segments[that._cols++];
        switch(method) {
            case "00":
                return {error: false, message: "c2sInstruction"};
            case "01":
                return {error: false, message: "c2sMessage"};
            case "10":
                return {error: false, message: "s2cTest"};
            case "11":
                return {error: false, message: "s2cMessage"};
            default:
                return {error: true, message: "undefined method in cols:" + that._cols};
        }
    }
    statusMapper = () => {
        //读取状态信息
        let that = this;
    }
    headerMapper = () => {
        //读取头信息
        let that = this;
        let declaim = that._segments[that._cols++];
        let headers = [];
        if(declaim!= "header")
            if(declaim == "body") return {error: false, message: headers};
            else return {error: true, message: "unsupported data in cols:" +that._cols};
        for(; ; that._cols++) {
            if(typeof(that._segments[that._cols]) == "undefined" || typeof(that._segments[that._cols]) == "body") break;
            let key_value = that._segments[that._cols].split(" ");
            if(key_value.length != 2) return {error: true, message: "unsupported headers in cols:" +that._cols};
            headers[key_value[0]] = key_value[1];   
        }
        return {error: false, message: headers};
    }
    bodyMapper = () => {
        //读取主体信息
        let that = this;
        let declaim = that._segments[that._cols++];
        let body = "";
        if(declaim!= "body") return {error: true, message: "unsupported data in cols:" +that._cols};
    
        for(; ; that._cols++) {
            if(typeof(that._segments[that._cols]) == "undefined") return {error: false, message: body};
            body += that._segments[that._cols]; 
        }
        // return {error: false, message: body};
    }
    
    _methodMapService = ["c2sInstruction", "c2sMessage"];
    methodCheckServer = (method) => {
        let that = this;
        let flag = false;
        for(let i = 0; i < that._methodMapService.length; i++) 
            if(that._methodMapService[i] == method.message){ flag = true; break; }
        if(!flag) return {error: true, message: "unsupported method"};
        else return {error: false, message: ""};
    }

    _hostMapServer = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/;
    _bodyTypeMapSerer = ["text", "voice", "file"];
    //host bodyType
    headersCheckServer = (headers) => {
        let that = this;
        let flag = false;
        headers = headers.message;

        let host = "";
        if(typeof(headers["host"]) == "undefined" || headers["host"] == null) return {error: true, message: "headers have not host"};
        else host = headers["host"];
        if(host.search(that._hostMapServer) != 0)
            return {error: true, message: "unsupported host"};


        let bodyType = "";
        if(typeof(headers["body-type"]) == "undefined" || headers["body-type"] == null) 
            return {error: true, message: "headers have not body-type"};
        else bodyType = headers["body-type"];

        let bodyTypeFlag = false;
        for(let i = 0; i < that._bodyTypeMapSerer.length; i++) 
            if(that._bodyTypeMapSerer[i] == bodyType){ bodyTypeFlag = true; break; }
        if(!bodyTypeFlag) return {error: true, message: "unsupported body-type"};
        
        return {error: false, message: ""};
    }
};
let form = function(message) {
    let mapper = new Mapper(message);
    return mapper;
}
exports.mapper = form;