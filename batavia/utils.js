
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

if (!atob) {
    var atob = function (b64string) {
        return new Buffer(b64string, 'base64').toString('binary');
    };
}

/*************************************************************************
 * A C-FILE like object
 *************************************************************************/

function PYCFile(data) {
    this.magic = data.slice(0, 4);
    this.modtime = data.slice(4, 8);
    this.size = data.slice(8, 12);
    this.data = data.slice(12);

    // this.data = data;
    this.depth = 0;
    this.ptr = 0;
    this.end = this.data.length;
    this.refs = [];
}

PYCFile.EOF = '\x04';

PYCFile.prototype.getc = function() {
    if (this.ptr < this.end) {
        return this.data[this.ptr++].charCodeAt();
    }
    throw PYCFile.EOF;
};

PYCFile.prototype.fread = function(n) {
    if (this.ptr + n <= this.end) {
        var retval = this.data.slice(this.ptr, this.ptr + n);
        this.ptr += n;
        return retval;
    }
    throw PYCFile.EOF;
};

/*************************************************************************
 * A Logger
 *************************************************************************/

function Logger() {
}

Logger.prototype.info = function(message) {
    console.log(message);
};

Logger.prototype.warning = function(message) {
    console.log('WARNING: ', message);
};

Logger.prototype.error = function(message) {
    console.log('ERROR: ', message);
};

/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

String.prototype.startswith = function (str) {
    return this.slice(0, str.length) === str;
};

/*************************************************************************
 * Modify Object to behave like a Python Dictionary
 *************************************************************************/

Object.prototype.update = function(values) {
    for (var key in values) {
        this.key = values[key];
    }
};

/*************************************************************************
 * Modify Array to behave like a Python List
 *************************************************************************/

Array.prototype.append = function(value) {
    this.push(value);
};

Array.prototype.extend = function(values) {
    this.push.apply(this, values);
};

/*************************************************************************
 * Subclass Object to provide a Set object
 *************************************************************************/

function Set(v) {
    Object.call(this, v);
}

Set.prototype = Object.create(Object.prototype);
Set.prototype.constructor = Set;

Set.prototype.add = function(v) {
    this[v] = null;
};

Set.prototype.remove = function(v) {
    delete this[v];
};
