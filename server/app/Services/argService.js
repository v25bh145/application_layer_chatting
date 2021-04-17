exports.run = function () {
    global.DEBUG_MODE = false;
    global.DEBUG_TEST_MODE = false;
    for (let i = 2; i < process.argv.length; i++) {
        switch (process.argv[i]) {
            case "--debug": {
                global.DEBUG_MODE = true;
                break;
            }
            case "--test": {
                global.DEBUG_TEST_MODE = true;
                break;
            }
            default: {
                console.log("参数错误: 未知启动参数 " + process.argv[i]);
                process.exit();
            }
        }
    }
};
