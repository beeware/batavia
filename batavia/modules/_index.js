/*
 * opcode module - potentially shared between dis and other modules which
 * operate on bytecodes (e.g. peephole optimizers).
 */

module.exports = {
    'base64': require('./base64').base64,
    'dis': require('./dis').dis,
    'dom': require('./dom').dom,
    'inspect': require('./inspect').inspect,
    'marshal': require('./marshal').marshal,
    'math': require('./math').math,
    'misc': require('./misc').misc,
    'sys': require('./sys').sys,
    'time': require('./time').time,
}
