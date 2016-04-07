
fixedConsoleLog = function(msg) {
    console.log.call(console, msg);
};

var batavia = {
    stdout: fixedConsoleLog,
    stderr: fixedConsoleLog,
    core: {},
    modules: {},
    builtins: {},
    exceptions: {}
};

