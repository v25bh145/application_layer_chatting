/**
 * 模块依赖
 */
let net = require("net");
let respondParser = require("./respondParser");
let readline = require("readline");
let waitRepository = require("./waitRepository");
let requestWrapper = require("./requestWrapper");
let errorHandler = require("./errorHandler");
let router = require("./router");

let rl=readline.createInterface(process.stdin,process.stdout);

let socket = net.connect(3000, "127.0.0.1", () => {
    console.log("连接成功！");
  });

socket.setEncoding('utf8');

let data = "";
socket.addListener("data", function(chunk) {
  if (respondParser.isFullChOl(chunk)) {
    //初始化request对象
    let request = requestWrapper.initRequest();
    //将ch-ol转换为respond对象
    let respondWrapped = respondParser.parse(chunk);
    if(respondWrapped.error == true) errorHandler.printError(respondWrapped);
    else {
        let respond = respondWrapped.message;
        console.log("接收到响应");
        console.log(respond);
        //路由器，后转控制器
        result = router.route(respond, request);
        console.log("产生结果")
        console.log(result);
        if(typeof(result.error) != "undefined" && result.error == true) errorHandler.printError(result);
        else {
          if(typeof(result.isSendToServerInstant) != "undefined" && result.isSendToServerInstant) {
            let chOl = requestWrapper.transRequestToChOl(result.request);
            socket.write(chOl);
          } else if(typeof(result.isSendToServerWaiting) != "undefined" && result.isSendToServerWaiting) {
            //将result.request 包装为wait对象
            waitRepository.setWait(result.wait);
          }
          if(typeof(result.isPrinted) != "undefined" && result.isPrinted) {
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
  let testFlag = false;
  //检查是否有请求在等待输入
  if(waitRepository.getWaitCount() > 0) {
    //客户端正在等待用户回应
    //请求是否会卡住用户发送信息
    if(waitRepository.getWait().canInputMessage) {
      //用户输入的数据是否符合请求规定的规范
      if(waitRepository.waitMessageCheck(line)) {
        //发送test包
        testFlag = true;
      } else {
        //发送message包
        testFlag = false;
      }
    } else {
      if(waitRepository.waitMessageCheck(line)) {
        //发送test包
        testFlag = true;
      } else {
        //报错，重来
        console.log("error> oops, please input the correct respond from server...");
        return;
      }
    }
  }
  let request = "";
  if(testFlag) {
    //发送test包
    console.log("发送test包");
    let nowWait = waitRepository.getWait();
    waitRepository.deleteWait();
    request = nowWait.request;
    request = requestWrapper.setRequestCovered(request, "00", line, "text");
  } else {
    //发送message包
    //初始化request对象
    console.log("发送message包");
    request = requestWrapper.initRequest();
    request = requestWrapper.setRequestCovered(request, "01", line, "text");
  }
  let chOl = requestWrapper.transRequestToChOl(request);
  socket.write(chOl);
});