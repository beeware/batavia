var credits = require('./credits')
var copyright = require('./copyright')

function license() {
    var sys = require('../modules/sys')
    sys.stdout.write('LICENSE file is available at https://github.com/beeware/batavia/blob/master/LICENSE\n')
    sys.stdout.write('\n')
    credits()
    sys.stdout.write('\n')
    copyright()
}
license.__doc__ = 'license()\n\nPrompt printing the license text, a list of contributors, and the copyright notice'

module.exports = license
