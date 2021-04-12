/**
 * 模块依赖
 */
let net = require("net");
let readline = require("readline");
//从终端接收数据
let lineService = require("./app/Providers/lineService");
//从服务器接收数据
let dataReceiveService = require("./app/Providers/dataReceiveService");

let socket = net.connect(3000, "127.0.0.1", () => {
    console.log("连接成功！");
});

socket.setEncoding("utf8");

dataReceiveService.run(socket);
lineService.run(socket);
