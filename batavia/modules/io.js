var fs = require('localstorage-fs')

var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var version = require('../core').version
var callables = require('../core').callables
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass

var io = {
    '__doc__': '',
    '__file__': 'batavia/modules/io.js',
    '__name__': 'io',
    '__package__': 'The io module provides the Python interfaces to stream handling. The\nbuiltin open function is defined in this module.\n\nAt the top of the I/O hierarchy is the abstract base class IOBase. It\ndefines the basic interface to a stream. Note, however, that there is no\nseparation between reading and writing to streams; implementations are\nallowed to raise an IOError if they do not support a given operation.\n\nExtending IOBase is RawIOBase which deals simply with the reading and\nwriting of raw bytes to a stream. FileIO subclasses RawIOBase to provide\nan interface to OS files.\n\nBufferedIOBase deals with buffering on a raw byte stream (RawIOBase). Its\nsubclasses, BufferedWriter, BufferedReader, and BufferedRWPair buffer\nstreams that are readable, writable, and both respectively.\nBufferedRandom provides a buffered interface to random access\nstreams. BytesIO is a simple stream of in-memory bytes.\n\nAnother IOBase subclass, TextIOBase, deals with the encoding and decoding\nof streams into text. TextIOWrapper, which extends it, is a buffered text\ninterface to a buffered raw stream (`BufferedIOBase`). Finally, StringIO\nis a in-memory stream for text.\n\nArgument names are not part of the specification, and only the arguments\nof open() are intended to be used as keyword arguments.\n\ndata:\n\nDEFAULT_BUFFER_SIZE\n\n   An int containing the default buffer size used by the module\'s buffered\n   I/O classes. open() uses the file\'s blksize (as obtained by os.stat) if\n   possible.\n'
}
      

io.IOBase = function(args, kwargs) {
	var types = require('../types')

	PyObject.call(this)
}

create_pyclass(io.IOBase, 'IOBase')


io.IOBase.__repr__ = function() {
	return '<IOBase object at 0x99999999>';
}

io.IOBase.prototype.__eq__ = function(other) {
	return this === other;
}

io.IOBase.prototype.__ne__ = function(other) {
	return this === other;
}

// io.IOBase.prototype.name = '';

io.IOBase.prototype.flush = function() {
//
}

// io.IOBase.prototype.tell = function() {
//
// }
//
// io.IOBase.prototype.{
//
// }

// since we're in Javascript, we're not in a TTY
io.IOBase.prototype.isatty = function() {
	return false;
}

//io.IOBase.prototype.buffer =
io.IOBase.prototype.softspace = 0

io.IOBase.prototype.readable = function() { return false  };  // IOBase isn't a read/write-able file; its a class
io.IOBase.prototype.writeable = function(){ return false  }; // that files inherit and override
io.IOBase.prototype.seekable = function() { return false  };

io.IOBase.prototype.seek = function() {
    throw new exceptions.UnsupportedOperation.$pyclass(
        'seek'
    )
}

io.IOBase.prototype.fileno = function() {
	// raise an unsupportedoperation exception
}

io.IOBase.prototype.xreadlines = function() {

}

module.exports = io