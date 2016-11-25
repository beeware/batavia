var io = require('../core').io;
var credits = require('./credits');
var copyright = require('./copyright');

var license = function() {
    io.stdout("LICENSE file is available at https://github.com/pybee/batavia/blob/master/LICENSE");
    credits();
    copyright();
};
license.__doc__ = 'license()\n\nPrompt printing the license text, a list of contributors, and the copyright notice';

module.exports = license;
