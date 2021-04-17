/**
 * 模块依赖
 */
let net = require("net");
let argService = require("./app/Services/argService");
let dataReceiveService = require("./app/Services/dataReceiveService");
let userRepository = require("./app/Repositories/userRepository");

argService.run();
/**
 * 创建服务器
 */
let server = net.createServer(function (socket) {
    socket.setEncoding("utf8");

    dataReceiveService.run(socket);

    socket.on("close", function () {
        userRepository.delete(userRepository.getUserBySocket(socket));
    });

    socket.on("error", function () {
        userRepository.delete(userRepository.getUserBySocket(socket));
    });
});
/**
 * 监听
 */
server.listen(3000, function () {
    console.log("\033[96m     server listening on *:3000\033[39m");
});
