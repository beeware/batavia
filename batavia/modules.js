/*
 * opcode module - potentially shared between dis and other modules which
 * operate on bytecodes (e.g. peephole optimizers).
 */

module.exports = {
    '_compile': require('./modules/_compile/_compile'),
    '_hashlib': require('./modules/_hashlib'),
    '_operator': require('./modules/_operator'),
    '_weakref': require('./modules/_weakref'),
    'base64': require('./modules/base64'),
    'dis': require('./modules/dis'),
    'dom': require('./modules/dom'),
    'inspect': require('./modules/inspect'),
    'marshal': require('./modules/marshal'),
    'math': require('./modules/math'),
    'sys': require('./modules/sys'),
    'time': require('./modules/time'),
    'random': require('./modules/random'),
    'webbrowser': require('./modules/webbrowser'),
    'json': require('./modules/json')
}
