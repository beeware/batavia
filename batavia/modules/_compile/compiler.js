var types = require('../../types')

var Compiler = function() {
    this.c_filename = null
    this.c_st = null // symtable
    this.c_future = null /* pointer to module's __future__ */
    this.c_flags = null

    this.c_optimize = 0              /* optimization level */
    this.c_interactive = 0           /* true if in interactive mode */
    this.c_nestlevel = 0

    this.u = null /* compiler_unit, compiler state for current block */
    this.c_stack = null           /* Python list holding compiler_unit ptrs */
    this.c_arena = null            /* pointer to memory allocation arena */

    this.c_stack = new types.List()
}

module.exports = Compiler
