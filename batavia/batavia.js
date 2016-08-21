
fixedConsoleLog = function(msg) {
    console.log.call(console, msg);
};

var batavia = {
    stdout: fixedConsoleLog,
    stderr: fixedConsoleLog,
    core: {},
    types: {},
    modules: {},
    builtins: {},
    vendored: {}
};

// set in PYCFile while parsing python bytecode
batavia.BATAVIA_MAGIC = null;
batavia.BATAVIA_MAGIC_34 = String.fromCharCode(238, 12, 13, 10);
batavia.BATAVIA_MAGIC_35 = String.fromCharCode(22, 13, 13, 10);
batavia.BATAVIA_MAGIC_35a0 = String.fromCharCode(248, 12, 13, 10);
