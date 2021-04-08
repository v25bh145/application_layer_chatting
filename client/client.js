/**
 * 模块依赖
 */
 let net = require('net');

 let socket = net.connect(3000, "127.0.0.1", () => {
   console.log("连接成功！");
 });
 socket.setEncoding('utf8');

 socket.write("ch-ol 0.0.1\n00\nheader\nhost 127.0.0.1\nbody-type text");

 socket.addListener("data", function(chunk) {
   console.log(chunk);
})
