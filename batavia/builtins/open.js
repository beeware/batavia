var exceptions = require('../core').exceptions
var types = require('../types')

function open(args, kwargs) {
	return new types.File(args, kwargs)
}

open.__doc__ = 'open(name[, mode[, buffering]]) -> file object\n\nOpen a file using the file() type, returns a file object.  This is the\npreferred way to open a file.  See file.__doc__ for further information.'

module.exports = open
