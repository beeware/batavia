/*************************************************************************
 * A C-FILE like object
 *************************************************************************/
var constants = require('../constants');

var PYCFile = function(data) {
    this.magic = data.slice(0, 4);
    this.modtime = data.slice(4, 8);
    this.size = data.slice(8, 12);
    this.data = data.slice(12);

    constants.BATAVIA_MAGIC = this.magic;

    // this.data = data;
    this.depth = 0;
    this.ptr = 0;
    this.end = this.data.length;
    this.refs = [];
}

PYCFile.EOF = '\x04';

PYCFile.prototype.getc = function() {
    if (this.ptr < this.end) {
        return String.fromCharCode(this.data[this.ptr++]);
    }
    return PYCFile.EOF;
}

PYCFile.prototype.fread = function(n) {
    if (this.ptr + n <= this.end) {
        var retval = this.data.slice(this.ptr, this.ptr + n);
        this.ptr += n;
        return retval;
    }
    return PYCFile.EOF;
}

module.exports = PYCFile;
