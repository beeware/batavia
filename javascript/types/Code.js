import { pyargs } from '../core/callables'
import { jstype, PyObject } from '../core/types'

/*************************************************************************
 * A Python code object
 *************************************************************************/

class PyCode extends PyObject {
    @pyargs({
        args: [
            'argcount', 'kwonlyargcount', 'nlocals', 'stacksize', 'flags',
            'code', 'consts', 'names', 'varnames', 'freevars', 'cellvars',
            'filename', 'name', 'firstlineno', 'lnotab'
        ]
    })
    __init__(argcount, kwonlyargcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab) {
        this.co_argcount = argcount || 0
        this.co_kwonlyargcount = kwonlyargcount || 0
        this.co_nlocals = nlocals || 0
        this.co_stacksize = stacksize || 0
        this.co_flags = flags || 0
        this.co_code = code
        this.co_consts = consts || []
        this.co_names = names || []
        this.co_varnames = varnames || []
        this.co_freevars = freevars || []
        this.co_cellvars = cellvars || []
        // co_cell2arg
        this.co_filename = filename || '<string>'
        this.co_name = name || '<module>'
        this.co_firstlineno = firstlineno || 1
        this.co_lnotab = lnotab || ''
        // co_zombieframe
        // co_weakreflist
    }
}

const pycode = jstype(PyCode, 'code', [], {})
export default pycode
