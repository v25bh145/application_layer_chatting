/**
 * 模块依赖
 */
let net = require('net');
let requestParser = require("./requestParser");
let errorHandler = require("./errorHandler");
let router = require("./router");
let respondWrapper = require("./respondWrapper");
let chOlReceiver = require("./chOlReceiver");
let userRepository = require("./userRepository");

/**
 * 创建服务器
 */
let server = net.createServer(function (socket) {

    socket.setEncoding('utf8');

    //发现data事件在自己这里是一个字符一个字符输出的，所以就做了个存储
    let data = "";

    socket.on('data', function (chunk) {

        if (chOlReceiver.isFullChOl(chunk)) {
            //初始化respond对象
            let respond = respondWrapper.initRespond();
            //将ch-ol转换为request对象
            let request = requestParser.parse(chunk);
            if(request.error == true) errorHandler.printError(request);
            else {
                //路由器，后转控制器
                respond = router.route(request, respond, socket);
                if(respond.error == true) errorHandler.printError(respond);
                else {
                    //将respond对象转换为ch-ol
                    let chOl = respondWrapper.transRespondToChOl(respond);
                    //如果需要发包，即发包给客户端
                    if(chOl)
                        for(let user in respond.sendTo)
                            user.write(chOl);
                }
            }
            data = "";
        } else {
            data += chunk;
        }
    })

    socket.on('close', function () {
        userRepository.deleteUserBySocket(socket);
    });
});
/**
 * 监听
 */
server.listen(3000, function () {
    console.log('\033[96m     server listening on *:3000\033[39m');
})