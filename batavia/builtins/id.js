var exceptions = require('../core').exceptions;

function id(args, kwargs) {
    throw new exceptions.PolyglotError.$pyclass("'id' has no meaning here. See docs/internals/limitations#id");
}
id.__doc__ = 'Return the identity of an object.  This is guaranteed to be unique among simultaneously existing objects.  (Hint: it\'s the object\'s memory address.)';

module.exports = id;
