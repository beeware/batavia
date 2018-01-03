import { create_pyclass, PyObject } from '../core/types'

/*************************************************************************
 * A Python code object
 *************************************************************************/

export default function Code(kwargs) {
    PyObject.call(this)

    this.co_argcount = kwargs.argcount || 0
    this.co_kwonlyargcount = kwargs.kwonlyargcount || 0
    this.co_nlocals = kwargs.nlocals || 0
    this.co_stacksize = kwargs.stacksize || 0
    this.co_flags = kwargs.flags || 0
    this.co_code = kwargs.code
    this.co_consts = kwargs.consts || []
    this.co_names = kwargs.names || []
    this.co_varnames = kwargs.varnames || []
    this.co_freevars = kwargs.freevars || []
    this.co_cellvars = kwargs.cellvars || []
    // co_cell2arg
    this.co_filename = kwargs.filename || '<string>'
    this.co_name = kwargs.name || '<module>'
    this.co_firstlineno = kwargs.firstlineno || 1
    this.co_lnotab = kwargs.lnotab || ''
    // co_zombieframe
    // co_weakreflist
}

create_pyclass(Code, 'code')
