import { call_function, call_method } from '../core/callables'
import { PyAttributeError, PyBaseException, PyGeneratorExit, PyStopIteration, PyTypeError } from '../core/exceptions'
import { create_pyclass, PyObject } from '../core/types'

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

export default class PyGenerator extends PyObject {
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
            throw new PyTypeError(
                'send() takes exactly one argument (' + arguments.length + ' given)'
            )
        }

        if (!this.started) {
            if (value !== null) {
                if (!types.isinstance(value, types.PyNoneType)) {
                    // It's illegal to send a non-None value on first call.
                    throw new PyTypeError(
                        "can't send non-None value to a just-started generator"
                    )
                }
            }
            this.started = true
        }
        if (this.finished) {
            throw new PyStopIteration()
        }
        this.gi_frame.stack.push(value)
        try {
            var yieldval = this.vm.run_frame(this.gi_frame)
        } catch (e) {
            this.finished = true
            throw e
        }
        if (this.finished) {
            throw new PyStopIteration()
        }
        return yieldval
    }

    throw(ExcType, value, traceback) {
        var yf_gen = yf_subgenerator(this)
        if (yf_gen !== null) {
            if (ExcType instanceof PyGeneratorExit ||
                    value instanceof PyGeneratorExit) {
                call_method(yf_gen, 'close', [])
            } else {
                try {
                    return call_method(yf_gen, 'throw', [ExcType, value, traceback])
                } catch (e) {
                    if (!(e instanceof PyAttributeError)) {
                        throw e
                    }
                }
            }
        }
        if (ExcType instanceof PyBaseException) {
            value = ExcType
            ExcType = ExcType.__class__
        } else {
            value = call_function(ExcType, [value], null)
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
            throw new PyStopIteration()
        }
        return yieldval
    }

    close() {
        try {
            return this['throw'](new PyGeneratorExit())
        } catch (e) {
            if (e instanceof PyGeneratorExit || e instanceof PyStopIteration) {
                this.vm.last_exception = null
                return null
            }
            throw e
        }
    }
}
create_pyclass(PyGenerator, 'generator')
