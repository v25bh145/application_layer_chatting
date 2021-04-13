/**
 * 模块依赖
 */
let net = require('net');
let dataReceiveService = require("./app/Services/dataReceiveService");
let userRepository = require("./app/Repositories/userRepository");

/**
 * 创建服务器
 */
let server = net.createServer(function (socket) {

    socket.setEncoding('utf8');

    dataReceiveService.run(socket);

    socket.on('close', function () {
        userRepository.delete(userRepository.findUserBySocket(socket));
    });
});
/**
 * 监听
 */
server.listen(3000, function () {
    console.log('\033[96m     server listening on *:3000\033[39m');
})