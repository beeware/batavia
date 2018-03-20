import { pyAttributeError, pyBaseException, pyGeneratorExit, pyStopIteration, pyTypeError } from '../core/exceptions'
import { jstype, PyObject, pyNone } from '../core/types'

import { dis } from '../modules/dis'

import * as types from '../types'

const YIELD_FROM = dis.opmap['YIELD_FROM']

// returns subgenerator gen is yielding from or null if there is none
function yf_subgenerator(gen) {
    var f = gen.gi_frame
    var opcode = f.f_code.co_code.valueOf()[f.f_lasti]
    if (opcode === YIELD_FROM) {
        return f.stack[1]
    }
    return null
}

/*************************************************************************
 * A Python generator type.
 *************************************************************************/

class PyGenerator extends PyObject {
    constructor(frame, vm) {
        super()

        this.vm = vm
        this.gi_frame = frame
        this.started = false
        this.finished = false
    }

    __iter__() {
        return this
    }

    __next__() {
        return this.send(null)
    }

    send(value) {
        if (arguments.length !== 1) {
            throw pyTypeError(
                'send() takes exactly one argument (' + arguments.length + ' given)'
            )
        }

        if (!this.started) {
            if (value !== null) {
                if (value !== pyNone) {
                    // It's illegal to send a non-pyNone value on first call.
                    throw pyTypeError(
                        "can't send non-pyNone value to a just-started generator"
                    )
                }
            }
            this.started = true
        }
        if (this.finished) {
            throw pyStopIteration()
        }
        this.gi_frame.stack.push(value)
        try {
            var yieldval = this.vm.run_frame(this.gi_frame)
        } catch (e) {
            this.finished = true
            throw e
        }
        if (this.finished) {
            throw pyStopIteration()
        }
        return yieldval
    }

    throw(ExcType, value, traceback) {
        var yf_gen = yf_subgenerator(this)
        if (yf_gen !== null) {
            if (ExcType === pyGeneratorExit.__class__ ||
                    types.isinstance(value, pyGeneratorExit)) {
                yf_gen.close()
            } else {
                try {
                    yf_gen.throw(ExcType, value, traceback)
                } catch (e) {
                    if (!(e instanceof pyAttributeError)) {
                        throw e
                    }
                }
            }
        }
        if (ExcType instanceof pyBaseException.__class__) {
            value = ExcType
            ExcType = ExcType.__class__
        } else {
            value = ExcType(value)
        }
        this.vm.last_exception = {
            'exc_type': ExcType,
            'value': value,
            'traceback': traceback
        }
        try {
            var yieldval = this.vm.run_frame(this.gi_frame)
        } catch (e) {
            this.finished = true
            throw e
        }
        if (this.finished) {
            throw pyStopIteration()
        }
        return yieldval
    }

    close() {
        try {
            return this['throw'](pyGeneratorExit())
        } catch (e) {
            if (types.isinstance(e, pyGeneratorExit) || types.isinstance(e, pyStopIteration)) {
                this.vm.last_exception = null
                return null
            }
            throw e
        }
    }
}

const pygenerator = jstype(PyGenerator, 'generator', [], null)
export default pygenerator
