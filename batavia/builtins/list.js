var types = require('../types');

var list = function(args) {
    if (!args || args.length === 0) {
      return new types.List();
    }
    return new types.List(args[0]);
};
list.__doc__ = "list() -> new empty list\nlist(iterable) -> new list initialized from iterable's items";

module.exports = list;
