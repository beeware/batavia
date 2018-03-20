import * as types from '../types'

// TODO: this should return a proper dictionary
export default function globals() {
    var gbl = this.frame.f_globals

    // support items() iterator
    gbl.items = function() {
        var l = []
        var keys = Object.keys(gbl)
        for (var i in keys) {
            var k = keys[i]
            // workaround until we have a proper dictionary
            if (k === 'items') {
                continue
            }
            l.push(types.pytuple([k, gbl[k]]))
        }
        l = types.pylist(l)
        return l
    }
    return gbl
}

globals.__name__ = 'globals'
globals.__doc__ = `globals() -> dictionary

Return the dictionary containing the current scope's global variables.`
globals.$pyargs = {
    surplus_args_error: (e) => `globals() takes no arguments (${e.given} given)`
}
