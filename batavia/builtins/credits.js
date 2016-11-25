var io = require('../core').io;

var credits = function(args, kwargs) {
    io.stdout("Thanks to all contributors, including those in AUTHORS, for supporting Batavia development. See https://github.com/pybee/batavia for more information");
};
credits.__doc__ = 'credits()\n\ninteractive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.';

module.exports = credits;
