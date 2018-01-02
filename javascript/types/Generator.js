import { call_function, call_method } from '../core/callables'
import { AttributeError, BaseException, GeneratorExit, StopIteration, TypeError } from '../core/exceptions'
import { PyObject } from '../core/types/object'
import { create_pyclass } from '../core/types/types'

import { dis } from '../modules/dis'

import * as types from '../types'

/*************************************************************************
 * A Python generator type.
 *************************************************************************/

export default function Generator(frame, vm) {
    PyObject.call(this)

    this.vm = vm
    this.gi_frame = frame
    this.started = false
    this.finished = false
};

create_pyclass(Generator, 'generator')

Generator.prototype.__iter__ = function() {
    return this
}

Generator.prototype.__next__ = function() {
    return this.send(null)
}

Generator.prototype.send = function(value) {
    if (arguments.length !== 1) {
        throw new TypeError.$pyclass(
            'send() takes exactly one argument (' + arguments.length + ' given)'
        )
    }

    if (!this.started) {
        if (value !== null) {
            if (!types.isinstance(value, types.NoneType)) {
                // It's illegal to send a non-None value on first call.
                throw new TypeError.$pyclass(
                    "can't send non-None value to a just-started generator"
                )
            }
        }
        this.started = true
    }
    if (this.finished) {
        throw new StopIteration.$pyclass()
    }
    this.gi_frame.stack.push(value)
    try {
        var yieldval = this.vm.run_frame(this.gi_frame)
    } catch (e) {
        this.finished = true
        throw e
    }
    if (this.finished) {
        throw new StopIteration.$pyclass()
    }
    return yieldval
}

Generator.prototype['throw'] = function(ExcType, value, traceback) {
    var yf_gen = yf_subgenerator(this)
    if (yf_gen !== null) {
        if (ExcType instanceof GeneratorExit.$pyclass ||
                value instanceof GeneratorExit.$pyclass) {
            call_method(yf_gen, 'close', [])
        } else {
            try {
                return call_method(yf_gen, 'throw', [ExcType, value, traceback])
            } catch (e) {
                if (!(e instanceof AttributeError.$pyclass)) {
                    throw e
                }
            }
        }
    }
    if (ExcType instanceof BaseException.$pyclass) {
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
        throw new StopIteration.$pyclass()
    }
    return yieldval
}

Generator.prototype['close'] = function() {
    try {
        return this['throw'](new GeneratorExit.$pyclass())
    } catch (e) {
        if (e instanceof GeneratorExit.$pyclass ||
                e instanceof StopIteration.$pyclass) {
            this.vm.last_exception = null
            return null
        }
        throw e
    }
}

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
