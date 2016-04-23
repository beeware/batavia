
/*************************************************************************
 * A C-FILE like object
 *************************************************************************/

batavia.core.PYCFile = function(data) {
    this.magic = data.slice(0, 4);
    this.modtime = data.slice(4, 8);
    this.size = data.slice(8, 12);
    this.data = data.slice(12);

    // this.data = data;
    this.depth = 0;
    this.ptr = 0;
    this.end = this.data.length;
    this.refs = [];
};

batavia.core.PYCFile.EOF = '\x04';

batavia.core.PYCFile.prototype.getc = function() {
    if (this.ptr < this.end) {
        return this.data[this.ptr++].charCodeAt();
    }
    return batavia.core.PYCFile.EOF;
};

batavia.core.PYCFile.prototype.fread = function(n) {
    if (this.ptr + n <= this.end) {
        var retval = this.data.slice(this.ptr, this.ptr + n);
        this.ptr += n;
        return retval;
    }
    return batavia.core.PYCFile.EOF;
};
