
fixedConsoleLog = function(msg) {
    console.log.call(console, msg);
};

windowInputPrompt = function(msg) {
  window.prompt(msg, "");
}

var batavia = {
    stdout: fixedConsoleLog,
    stderr: fixedConsoleLog,
    input: windowInputPrompt,
    core: {},
    types: {},
    modules: {},
    builtins: {}
};
