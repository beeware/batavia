const vm = require('vm')

process.on('message', function(message) {
    const batavia = require(message.bataviaSource)

    // This cache is global, instead of per batavia.VirtualMachine instance...
    batavia.modules.sys.modules = {}

    process.send(_capture_stdout(() => {
        const m = require('module')
        vm.runInThisContext(m.wrap(message.code))(exports, require, module, __filename, __dirname)
    }))
})

/**
 * Run a function, capturing stdout and returning everything written to it.
 *
 * @param {function()} f The function to run.
 * @return {string}
 * @private
 */
function _capture_stdout(f) {
    let output = ''
    const old_write = process.stdout.write

    process.stdout.write = (str, encoding, fd) => {
        output += str
    }

    f()

    process.stdout.write = old_write

    return output
}
