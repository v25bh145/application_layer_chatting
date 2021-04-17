/**
 * 模块依赖
 */
let net = require("net");
let readline = require("readline");
//启动参数
let argService = require("./app/Services/argService");
//从终端接收数据
let lineService = require("./app/Services/lineService");
//从服务器接收数据
let dataReceiveService = require("./app/Services/dataReceiveService");

let socket = net.connect(3000, "127.0.0.1", () => {
    console.log("连接成功！");
});

socket.setEncoding("utf8");

argService.run(socket);
dataReceiveService.run(socket);
lineService.run(socket);

socket.on('error', function() {
    console.log("与服务器断开连接");
})