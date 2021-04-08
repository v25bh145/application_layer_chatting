/**
 * 模块依赖
 */
let net = require('net');
let respondParser = require('./respondParser');
let readline = require('readline');
let waitRepository = require('./waitRepository');

let rl=readline.createInterface(process.stdin,process.stdout);

let socket = net.connect(3000, "127.0.0.1", () => {
    console.log("连接成功！");
  });

socket.setEncoding('utf8');

socket.write("ch-ol 0.0.1\n00\nheader\nhost 127.0.0.1\nbody-type text");

let data = "";
socket.addListener("data", function(chunk) {
  if (respondParser.isFullChOl(chunk)) {
    //初始化request对象
    let request = requestWrapper.initRespond();
    //将ch-ol转换为respond对象
    let respond = respondParser.parse(chunk);
    if(respond.error == true) errorHandler.printError(respond);
    else {
        //路由器，后转控制器
        result = router.route(respond, request);
        if(typeof(result.error) != "undefined" && result.error == true) errorHandler.printError(result);
        else {
          if(typeof(result.isSendToServerInstant) != "undefined" && result.isSendToServerInstant) {
            let chOl = requestWrapper.transRequestToChOl(result.request);
            socket.write(chOl);
            waitRepository.setWait(result.request);
          } else if(typeof(result.isSendToServerWaiting) != "undefined" && result.isSendToServerWaiting) {
            /*将result.request 包装为wait对象*/
          }
          if(result.isPrinted) {
            console.log(result.message)
          }
        }
    }
    data = "";
} else {
    data += chunk;
}
});

rl.on('line', function (line) {
  if(waitRepository.getWaitQueueCounts > 0) {
    //客户端正在等待用户回应
    //检查输入-否则重来
  } else {
    //正常发送消息

  }
});