import BigNumber from 'bignumber.js'
// Set up the core interpreter.
import * as core from './core'

// // Set up the core interpreter.
import * as types from './types'

// // Set up the builtins
import * as builtins from './builtins'

import VirtualMachine from './VirtualMachine'

BigNumber.config({
    DECIMAL_PLACES: 324,
    ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
})

console.log('core', core)
console.log('types', types)
console.log('builtins', builtins)
console.log('VM', VirtualMachine)
console.log('EXPORT BATAVIA')

// Export the full Batavia namespace.
export {
    core,
    types,
    builtins,
    VirtualMachine
}
