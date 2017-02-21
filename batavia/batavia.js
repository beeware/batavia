
// Configure dependencies
var BigNumber = require('bignumber.js')
BigNumber.config({
    DECIMAL_PLACES: 324,
    ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
})

var batavia = {}

// Set up the core interpreter.
batavia['core'] = require('./core')

// Set up the core interpreter.
batavia['types'] = require('./types')

// Set up the modules, including builtins and code from ouroboros
batavia['builtins'] = require('./builtins')
batavia['modules'] = require('./modules')
batavia['stdlib'] = require('./stdlib')

// Lastly, the virtual machine itself.
batavia['VirtualMachine'] = require('./VirtualMachine')

// Export the full Batavia namespace.
module.exports = batavia
