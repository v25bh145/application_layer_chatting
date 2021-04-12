/**
 * 模块依赖
 */
let net = require("net");
let respondParser = require("./clientChOlLib/RespondHandler/respondParser");
let readline = require("readline");
let waitRepository = require("./app/Repositories/waitRepository");
let requestWrapper = require("./clientChOlLib/RequestHandler/requestWrapper");
let errorHandler = require("./app/Exceptions/exceptionHandler");
let router = require("./Router/router");

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
            //将result.request包装为wait对象存在缓存中
            result.wait.save();
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
  if(waitRepository.getCounts() > 0) {
    //客户端正在等待用户回应
    //请求是否会卡住用户发送信息
    let nowWait = waitRepository.getFirst();
    if(nowWait.canInputMessage) {
      //用户输入的数据是否符合请求规定的规范
      if(nowWait.checkMessage(line)) {
        //发送test包
        testFlag = true;
      } else {
        //发送message包
        testFlag = false;
      }
    } else {
      if(nowWait.checkMessage(line)) {
        //发送test包
        testFlag = true;
      } else {
        //TODO: 报错，重来
        console.log("error> oops, please input the correct respond from server...");
        return;
      }
    }
  }
  let request = "";
  if(testFlag) {
    //发送针对服务器test的请求包
    console.log("发送test包");
    let nowWait = waitRepository.getFirst();
    console.log(nowWait);
    request = nowWait.request;
    request = requestWrapper.setRequestCovered(request, "00", line, "text");
    nowWait.delete();
  } else {
    //检查内容，如果为指令则发送指令包，否则发送message包
    let str = line.split(" ");
    switch(str) {
      case "file": {
        console.log("发送file包");
        
        break;
      }
      case "voice": {
        console.log("发送voice包");
        break;
      }
      default: {
        //初始化request对象
        console.log("发送message包");
        request = requestWrapper.initRequest();
        request = requestWrapper.setRequestCovered(request, "01", line, "text");
      }
    }
  }
  console.log(request);
  let chOl = requestWrapper.transRequestToChOl(request);
  socket.write(chOl);
});