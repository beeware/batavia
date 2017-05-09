
// Configure dependencies
var BigNumber = require('bignumber.js')
BigNumber.config({
    DECIMAL_PLACES: 324,
    ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
})

// Configure logging.
if (process.env.PYBEE_DEBUG && process.env.PYBEE_DEBUG !== '0') {
    // We are in debug mode! Log all the things!
    debug = console.log;
} else {
    // We are not in debug mode. Please be quiet!
    debug = function() {};
}


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
