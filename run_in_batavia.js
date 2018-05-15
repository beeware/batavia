#!/usr/bin/env node
/**
 * Run Python file in a new Batavia VM.
 */

const fs = require('fs')
const path = require('path')
const {spawnSync} = require('child_process')
const batavia = require('./batavia/batavia.js')

// The compile_module script is in the same directory as this script.
const compileScriptPath = path.join(__dirname, 'compile_module.py')

function displayHelpText() {
    console.log(`
usage: [-h] file

Runs Python file in node JS using using the Batavia virtual machine in Node.

positional arguments:
  file             Python file to run

optional arguments:
  -h, --help       show this help message and exit`.trim())
}

function main() {
    if (process.argv.length === 3) {
        const argument = process.argv[2]

        if (argument === '-h' || argument === '--help') {
            displayHelpText()
            return
        }

        let resolveBase
        // The INIT_CWD environment variable is set in npm v5.4 and above. It
        // contains the directory in which the npm was run. If we have that
        // information we can resolve paths relative to it.
        // If the file path not relative and INIT_CWD is defined, we'll resolve
        // the provided path relative to it.
        if (process.env.INIT_CWD && !path.isAbsolute(argument[0])) {
            resolveBase = process.env.INIT_CWD
        } else {
            resolveBase = ''
        }

        const filePath = path.resolve(resolveBase, argument)
        const modulePath = path.basename(filePath, '.py')
        const basePath = path.dirname(filePath)

        fs.access(
            filePath,
            fs.constants.F_OK | fs.constants.R_OK,
            function(err) {
                if (err) {
                    console.log(
                        'File "' + argument + '" does not exist ' +
                        'or cannot be accessed by current user.')
                } else {
                    try {
                        runInBatavia(basePath, modulePath)
                    } catch (error) {
                        if (error instanceof TypeError) {
                            console.log('Invalid Python file.')
                        } else throw error
                    }
                }
            })
    } else {
        displayHelpText()
    }
}

/**
 * Runs the specified Python module
 *
 * @param basePath
 * @param module
 */
function runInBatavia(basePath, module) {
    const vm = new batavia.VirtualMachine({
        loader: makeBataviaLoader(basePath),
        frame: null
    })

    vm.run(module, [])
}

/**
 * Creates a loader function for the Batavia VM that looks for code around the
 * specified base path.
 *
 * @param basePath
 * @returns {bataviaLoader}
 */
function makeBataviaLoader(basePath) {
    /**
     * Compiles the specified Python module and returns its bytecode in the
     * format that Batavia expects. Returns null if module was not found so an
     * ImportError can be raised.
     *
     * @param modulePath
     * @returns {*}
     */
    function bataviaLoader(modulePath) {
        const compileProcess = spawnSync(
            'python3',
            [compileScriptPath, modulePath],
            {cwd: basePath}
        )

        checkForErrors(compileProcess)

        const module = JSON.parse(compileProcess.stdout)

        // Module compiler will output null if the specified module was not
        // found.
        if (!module) { return null }

        return {
            '__python__': true,
            'bytecode': module.bytecode.trim(),
            'filename': module.filename.trim()
        }
    }

    return bataviaLoader
}

/**
 * Checks the Python compile process result for errors. In case of error it
 * alerts the user quits the program.
 *
 * @param processResult
 */
function checkForErrors(processResult) {
    if (processResult.error) {
        console.log(
            'There was an error running the Python compile process.\n' +
            'Ensure that Python 3 is installed and available as "python3".')
        process.exit(1)
    }
    if (processResult.status !== 0) {
        console.log('There was an error during import.')
        console.log(processResult.stderr.toString())
        process.exit(1)
    }
}

if (require.main === module) {
    main()
}
