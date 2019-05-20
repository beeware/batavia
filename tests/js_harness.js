const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const http = require('http')
const cp = require('child_process')

const app = express()

const FOUR_SECOND_TIMEOUT = 4000

const portNameFile = process.argv[2]
const bataviaSource = process.argv[3]

app.use(bodyParser.json({limit: '50mb'}))

app.post('/', (request, response) => {
    _execute_with_batavia(request.body.code, (data) => response.end(data))
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

let child = cp.fork('tests/test_worker')

/**
 * Execute JS code in a sandbox including the batavia.js runtime.
 *
 * @param {string} code Code snippet to execute.
 * @param {function(string)} callback
 * @return {string}
 */
function _execute_with_batavia(code, callback) {
    const reportTimeout = setTimeout(() => {
        child.kill()
        callback('********** JAVASCRIPT EXECUTION TIMED OUT **********')
        child = cp.fork('tests/test_worker')
    }, FOUR_SECOND_TIMEOUT)

    child.on('message', (output) => {
        clearTimeout(reportTimeout)
        callback(output)
    })

    child.send({bataviaSource, code})
}
