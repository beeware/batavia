var Cell = require('./Cell');

var Frame = function(kwargs) {
    var v, i;

    this.f_code = kwargs.f_code;
    this.f_globals = kwargs.f_globals;
    this.f_locals = kwargs.f_locals;
    this.f_back = kwargs.f_back;
    this.stack = [];

    if (this.f_back) {
        this.f_builtins = this.f_back.f_builtins;
    } else {
        this.f_builtins = this.f_globals['__builtins__'];
        if (this.f_builtins.hasOwnProperty('__dict__')) {
            this.f_builtins = this.f_builtins.__dict__;
        }
    }

    this.f_lineno = this.f_code.co_firstlineno;
    this.f_lasti = 0;

    if (this.f_code.co_cellvars.length > 0) {
        this.cells = {};
        if (this.f_back && !this.f_back.cells) {
            this.f_back.cells = {};
        }
        for (i = 0; i < this.f_code.co_cellvars.length; i++) {
            // Make a cell for the variable in our locals, or null.
            v = this.f_code.co_cellvars[i];
            this.cells[v] = new Cell(this.f_locals[v]);
            if (this.f_back) {
                this.f_back.cells[v] = this.cells[v];
            }
        }
    } else {
        this.cells = null;
    }

    if (this.f_code.co_freevars.length > 0) {
        if (!this.cells) {
            this.cells = {};
        }
        for (i = 0; i < this.f_code.co_freevars.length; i++) {
            v = this.f_code.co_freevars[i];
            // assert(this.cells !== null);
            // assert(this.f_back.cells, "f_back.cells: " + this.f_back.cells);
            this.cells[v] = this.f_back.cells[v];
        }
    }
    this.block_stack = [];
    this.generator = null;

}

Frame.prototype.toString = function() {
    return '<Frame at 0x' + id(self) + ': ' + this.f_code.co_filename +' @ ' + this.f_lineno + '>';
}

Frame.prototype.__repr__ = function() {
    return '<Frame at 0x' + id(self) + ': ' + this.f_code.co_filename +' @ ' + this.f_lineno + '>';
}

Frame.prototype.line_number = function() {
    // Get the current line number the frame is executing.
    // We don't keep f_lineno up to date, so calculate it based on the
    // instruction address and the line number table.
    // var lnotab = this.f_code.co_lnotab;
    var byte_increments = []; //six.iterbytes(lnotab[0::2]);
    var line_increments = []; //six.iterbytes(lnotab[1::2]);

    byte_num = 0;
    line_num = this.f_code.co_firstlineno;

    for (var incr in byte_increments) {
        var byte_incr = byte_increments[incr];
        var line_incr = line_increments[incr];

        byte_num += byte_incr;
        if (byte_num > this.f_lasti) {
            break;
        }
        line_num += line_incr;
    }

    return line_num;
}

module.exports = Frame;
