
function help(args, kwargs) {
    var sys = require('../modules/sys')
    sys.stdout.write('For help, please see: https://github.com/beeware/batavia.')
}
help.__doc__ = 'In Python, this is a wrapper around pydoc.help. In Batavia, this is a link to the README.'

module.exports = help
