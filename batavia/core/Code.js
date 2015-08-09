
batavia.core.Code = function(kwargs) {
    this.co_argcount = kwargs.argcount || 0;
    this.co_cellvars = kwargs.cellvars || [];
    this.co_code = kwargs.code;
    this.co_consts = kwargs.consts || [];
    this.co_filename = kwargs.filename || '<string>';
    this.co_firstlineno = kwargs.firstlineno || 1;
    this.co_flags = kwargs.flags || 0;
    this.co_freevars = kwargs.freevars || 0;
    this.co_lnotab = kwargs.lnotab || '';
    this.co_name = kwargs.name || '<module>';
    this.co_names = kwargs.names || [];
    this.co_nlocals = kwargs.nlocals || 0;
    this.co_stacksize = kwargs.stacksize || 0;
    this.co_varnames = kwargs.varnames || [];
};
