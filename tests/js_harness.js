const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const http = require('http')
const vm = require('vm')

const app = express()

const portNameFile = process.argv[2]
const bataviaSource = process.argv[3]

app.use(bodyParser.json({limit: '50mb'}))

app.post('/', (request, response) => {
    response.end(_execute_with_batavia(request.body.code))
})

const server = http.createServer(app)
server.listen(0, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    // Write out the port number so the python tests can call us.
    fs.writeFile(portNameFile, `${server.address().port}`, (err) => {
        if (err) {
            return console.log('something bad happened', err)
        }
    })
})

/**
 * Execute JS code in a sandbox including the batavia.js runtime.
 *
 * @param {string} code Code snippet to execute.
 * @return {string}
 */
function _execute_with_batavia(code) {
    const batavia = require(bataviaSource)

    // This cache is global, instead of per batavia.VirtualMachine instance...
    batavia.modules.sys.modules = {}

    return _capture_stdout(() => {
        const m = require('module')
        vm.runInThisContext(m.wrap(code))(exports, require, module, __filename, __dirname)
    })
}

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
