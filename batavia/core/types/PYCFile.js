var constants = require('../constants')

/*************************************************************************
 * A C-FILE like object
 *************************************************************************/

var PYCFile = function(data) {
    Object.call(this)
    this.magic = data.slice(0, 4)
    this.modtime = data.slice(4, 8)
    this.size = data.slice(8, 12)
    this.data = data.slice(12)

    constants.BATAVIA_MAGIC = String.fromCharCode(
        this.magic[0],
        this.magic[1],
        this.magic[2],
        this.magic[3]
    )

    // this.data = data;
    this.depth = 0
    this.ptr = 0
    this.end = this.data.length
    this.refs = []
}

PYCFile.EOF = '\x04'

PYCFile.prototype.toString = function() {
    return '<PYCFile (' + this.data.length + ' bytes, ptr=' + this.ptr + ')>'
}

PYCFile.prototype.getc = function() {
    if (this.ptr < this.end) {
        return this.data[this.ptr++]
    }
    return PYCFile.EOF
}

PYCFile.prototype.fread = function(n) {
    if (this.ptr + n <= this.end) {
        var retval = this.data.slice(this.ptr, this.ptr + n)
        this.ptr += n
        return retval
    }
    return PYCFile.EOF
}

module.exports = PYCFile
