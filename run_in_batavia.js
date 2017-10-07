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

        const filePath = path.resolve(argument)
        const modulePath = path.basename(filePath)
        const basePath = path.dirname(filePath)

        fs.access(
            filePath,
            fs.constants.F_OK | fs.constants.R_OK,
            function(err) {
                if (err) {
                    console.log(
                        'Specified file does not exist, ' +
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

if (require.main === module) {
    main()
}
