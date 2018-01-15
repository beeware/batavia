import BigNumber from 'bignumber.js'

import * as types from './types'
import * as builtins from './builtins'
import VirtualMachine from './VirtualMachine'

BigNumber.config({
    DECIMAL_PLACES: 324,
    EXPONENTIAL_AT: 324,
    ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
})

// Export the full Batavia namespace.
export {
    types,
    builtins,
    VirtualMachine
}
