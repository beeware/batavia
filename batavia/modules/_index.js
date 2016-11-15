/*
 * opcode module - potentially shared between dis and other modules which
 * operate on bytecodes (e.g. peephole optimizers).
 */

module.exports = {
    '_compile': require('./_compile/_compile'),
    '_operator': require('./_operator'),
    '_weakref': require('./_weakref'),
    'base64': require('./base64'),
    'dis': require('./dis'),
    'dom': require('./dom'),
    'inspect': require('./inspect'),
    'marshal': require('./marshal'),
    'math': require('./math'),
    'sys': require('./sys'),
    'time': require('./time'),
}
