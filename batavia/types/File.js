var fs = require('localstorage-fs')
var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var FileIterator = require('./FileIterator')

/*************************************************************************
 * A Python generator type.
 *************************************************************************/

function File(args, kwargs) {
	var types = require('../types')
	
    PyObject.call(this)
	
	this.path = args[0];
	this.mode = args[1];

	if (fs.readFileSync(this.path)) {
		this.lines = types.Str(fs.readFileSync(this.path)).split("\n");
	}
	else {
		this.contents = [types.Str("")]
	}
	
	this.closed = false;
	this.lineno = 0;
	this.isatty = false; // since it's in JS, never is a tty (?)
}

// create the file class
create_pyclass(File, 'file')

File.prototype.read = function() {
	
	if (this.mode.indexof('r') == -1)  {
		throw new exceptions.IOError.$pyclass('File not open for reading')
	}
	
	if (this.closed) {
		throw new exceptions.ValueError.$pyclass('I/O operation on closed file')
	}
	
	var out = ""
	for (var i = this.lineno; i < this.lines.length; i++) {
		out += this.contents[i] + "\n"
	}
	
	return out
}

File.prototype.readline = function() {
	this.lineno += 1
	return this.contents.split("\n")[lineno - 1]
}

File.prototype.readlines = function() {
	this.lineno = this.contents.split("\n").length
	var out = []
	for (var i = this.lineno; i < this.lines.length; i++) {
		out.append(this.contents[i] + "\n")
	}
	return out
	
}

File.prototype.write = function(string) {
	if (this.mode.indexof('w') == -1)  {
		throw new exceptions.IOError.$pyclass('File not open for writing')
	}		

	else if (this.closed) {
		throw new exceptions.ValueError.$pyclass('I/O operation on closed file')
	}
	
	else if (this.mode.indexof('a') == -1) {
		fs.writeFileSync(this.path, string)
	}
	
	else {
		fs.appendFileSync(this.path, string)
	}
}

File.prototype.writelines = function(lines) {
	if (this.mode.indexof('w') == -1)  {
		throw new exceptions.IOError.$pyclass('File not open for writing')
	}		

	else if (this.closed) {
		throw new exceptions.ValueError.$pyclass('I/O operation on closed file')
	}
	
	else if (this.mode.indexof('a') == -1) {
		fs.writeFileSync(this.path, lines.join(""))
	}
	
	else {
		fs.appendFileSync(this.path, lines.join(""))
	}
} 

File.prototype.__str__ = function() {
	return "<open file '" + this.path + "'., mode '" + this.mode + "' at 0x99999999>"
}

File.prototype.__iter__ = function() {
	return new FileIterator(this.contents.split("\n"))
}

File.prototype.close = function() {
	this.closed = true
}

File.prototype.fileno = function() {
	return new exceptions.NotImplementedError.$pyclass("File.fileno not implemented")
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = File
