import BigNumber from 'bignumber.js'

import * as types from './types'
import * as builtins from './builtins'
import * as modules from './modules'
import * as version from './core/version'
import VirtualMachine from './VirtualMachine'

BigNumber.config({
    DECIMAL_PLACES: 324,
    EXPONENTIAL_AT: 2048,
    ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
})

// Export the full Batavia namespace.
export {
    version,
    types,
    builtins,
    modules,
    VirtualMachine
}
