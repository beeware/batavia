var exceptions = require('../core').exceptions;


function next(args, kwargs) {
    //if its iterable return next thing in iterable
    //else stop iteration
    throw new exceptions.NotImplementedError.$pyclass("Builtin Batavia function 'next' not implemented");
}
next.__doc__ = 'next(iterator[, default])\n\nReturn the next item from the iterator. If default is given and the iterator\nis exhausted, it is returned instead of raising StopIteration.';

module.exports = next;
