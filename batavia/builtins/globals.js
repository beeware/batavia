var exceptions = require('../core').exceptions;
var types = require('../types');


// TODO: this should return a proper dictionary
function globals(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("globals() doesn't accept keyword arguments");
    }
    if (args && args.length != 0) {
        throw new exceptions.TypeError.$pyclass('globals() takes no arguments (' + args.length + ' given)');
    }
    var gbl = this.frame.f_globals;

    // support items() iterator
    gbl.items = function() {
        var l = [];
        var keys = Object.keys(gbl);
        for (var i in keys) {
            var k = keys[i];
            // workaround until we have a proper dictionary
            if (k == 'items') {
              continue;
            }
            l.push(new types.Tuple([k, gbl[k]]));
        }
        l = new types.List(l);
        return l;
    };
    return gbl;
}
globals.__doc__ = "globals() -> dictionary\n\nReturn the dictionary containing the current scope's global variables.";

module.exports = globals;
