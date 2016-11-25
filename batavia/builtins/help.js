var io = require('../core').io;

var help = function() {
    io.stdout("For help, please see: https://github.com/pybee/batavia.");
};
help.__doc__ = 'In Python, this is a wrapper around pydoc.help. In Batavia, this is a link to the README.';

module.exports = help;
