const fs = require('fs');
const { spawnSync } = require('child_process');

module.exports = function(path) {
    const python = spawnSync('python3', ['compile-and-encode.py', path])
    const ret = {
        '__python__': true,
        'bytecode': python.stdout.toString().trim(),
        'filename': path + '.py'
    }
    return ret;
}
