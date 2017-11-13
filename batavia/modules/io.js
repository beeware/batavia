var fs = require('localstorage-fs')

var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var version = require('../core').version
var callables = require('../core').callables
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass

var io = {
    '__doc__': 'The io module provides the Python interfaces to stream handling. The\nbuiltin open function is defined in this module.\n\nAt the top of the I/O hierarchy is the abstract base class IOBase. It\ndefines the basic interface to a stream. Note, however, that there is no\nseparation between reading and writing to streams; implementations are\nallowed to raise an IOError if they do not support a given operation.\n\nExtending IOBase is RawIOBase which deals simply with the reading and\nwriting of raw bytes to a stream. FileIO subclasses RawIOBase to provide\nan interface to OS files.\n\nBufferedIOBase deals with buffering on a raw byte stream (RawIOBase). Its\nsubclasses, BufferedWriter, BufferedReader, and BufferedRWPair buffer\nstreams that are readable, writable, and both respectively.\nBufferedRandom provides a buffered interface to random access\nstreams. BytesIO is a simple stream of in-memory bytes.\n\nAnother IOBase subclass, TextIOBase, deals with the encoding and decoding\nof streams into text. TextIOWrapper, which extends it, is a buffered text\ninterface to a buffered raw stream (`BufferedIOBase`). Finally, StringIO\nis a in-memory stream for text.\n\nArgument names are not part of the specification, and only the arguments\nof open() are intended to be used as keyword arguments.\n\ndata:\n\nDEFAULT_BUFFER_SIZE\n\n   An int containing the default buffer size used by the module\'s buffered\n   I/O classes. open() uses the file\'s blksize (as obtained by os.stat) if\n   possible.\n',
    '__file__': 'batavia/modules/io.js',
    '__name__': 'io',
    '__package__': ''
}

io.IOBase = function(args, kwargs) {
	var types = require('../types')

	PyObject.call(this)
}

create_pyclass(io.IOBase, 'IOBase')

io.IOBase.__repr__ = function() {
	return '<IOBase object at 0x99999999>'
}

// io files will never be equal unless they both reference the same object,
// since they are types actively reading from the system and maintaining appropriate state
io.IOBase.prototype.__eq__ = function(other) {
	return this === other
}

io.IOBase.prototype.__ne__ = function(other) {
	return this === other
}

io.IOBase.prototype.close = function() {
	if (this.closed) {
		this.flush()
		this.closed = true
	}
	else {
		// only the first call will have an effect; multiple close()
		// operations allowed for convenience.
	}
}

io.IOBase.prototype.closed = false

io.IOBase.prototype.fileno = function() {
    throw new exceptions.UnsupportedOperation.$pyclass(
        'fileno'
    )
}

io.IOBase.prototype.flush = function() {
}

// since we're in Javascript, we're not in a TTY
io.IOBase.prototype.isatty = function() {
	return false
}

io.IOBase.prototype.readable = function() {
	return false
}

io.IOBase.prototype.readline = function() {
	
}

io.IOBase.prototype.readlines = function() {
	
}

io.IOBase.prototype.seek = function() {
    throw new exceptions.UnsupportedOperation.$pyclass(
        'seek'
    )
}

io.IOBase.prototype.seekable = function() {
	return false;
}

io.IOBase.prototype.tell = function() {
    throw new exceptions.UnsupportedOperation.$pyclass(
        'seek'
    )
}

io.IOBase.prototype.truncate = function() {
    throw new exceptions.UnsupportedOperation.$pyclass(
        'truncate'
    )
}

io.IOBase.prototype.fileno = function() {
	io.IOBase.prototype.tell = function() {
	    throw new exceptions.UnsupportedOperation.$pyclass(
	        'fileno'
	    )
	}
}


io.IOBase.prototype.softspace = 0

io.IOBase.prototype.seekable = function() { return false }

io.IOBase.prototype.writeable = function(){
	return false
}

io.IOBase.prototype.writelines = function(lines) {
	callables.iter_for_each(lines, function(line) {
		// NOTE: writelines does not add newlines.
		// This is equivalent to calling write() for each string. (from CPython io.writelines docstring)
		this.write(line)
	})
}

io.IOBase.prototype.__del__ = function() {
	this.close();
}

// These functions intentionally commented out! IOBase is a
// type that is only intended to be inherited from and does not have
// a public constructor. Each instance of IOBase implements read() and write()
// based on the actual object itself, which readlines(), writelines(), and xreadlines()
// then use.

// io.IOBase.prototype.read = function() {
//
// }
//
// io.IOBase.prototype.write = function() {
//
// }

module.exports = io