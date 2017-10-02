/**
 * This loader implementation for Batavia launches a Python process to compile Python modules
 * to bytecode as they are imported.
 *
 * NOTE: This loader will only work under Node.js
 */
const {spawnSync} = require('child_process');

module.exports = function(path) {
    const python = spawnSync('python3', ['compile-and-encode.py', path]);

    const {filename, bytecode} = JSON.parse(python.stdout);

    return {
        '__python__': true,
        'bytecode': bytecode.trim(),
        'filename': filename.trim()
    };
}
