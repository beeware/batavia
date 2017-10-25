var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var callables = require('../core').callables
var dis = require('../modules/dis')

/*************************************************************************
 * A Python generator type.
 *************************************************************************/

function Generator(frame, vm) {
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
        throw new exceptions.TypeError.$pyclass(
            'send() takes exactly one argument (' + arguments.length + ' given)'
        )
    }

    if (!this.started) {
        if (value !== null) {
            var types = require('../types')
            if (!types.isinstance(value, types.NoneType)) {
                // It's illegal to send a non-None value on first call.
                throw new exceptions.TypeError.$pyclass(
                    "can't send non-None value to a just-started generator"
                )
            }
        }
        this.started = true
    }
    if (this.finished) {
        throw new exceptions.StopIteration.$pyclass()
    }
    this.gi_frame.stack.push(value)
    try {
        var yieldval = this.vm.run_frame(this.gi_frame)
    } catch (e) {
        this.finished = true
        throw e
    }
    if (this.finished) {
        throw new exceptions.StopIteration.$pyclass()
    }
    return yieldval
}

Generator.prototype['throw'] = function(ExcType, value, traceback) {
    var yf_gen = yf_subgenerator(this)
    if (yf_gen !== null) {
        if (ExcType instanceof exceptions.GeneratorExit.$pyclass ||
                value instanceof exceptions.GeneratorExit.$pyclass) {
            callables.call_method(yf_gen, 'close', [])
        } else {
            try {
                return callables.call_method(yf_gen, 'throw', [ExcType, value, traceback])
            } catch (e) {
                if (!(e instanceof exceptions.AttributeError.$pyclass)) {
                    throw e
                }
            }
        }
    }
    if (ExcType instanceof exceptions.BaseException.$pyclass) {
        value = ExcType
        ExcType = ExcType.__class__
    } else {
        value = callables.call_function(ExcType, [value], null)
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
        throw new exceptions.StopIteration.$pyclass()
    }
    return yieldval
}

Generator.prototype['close'] = function() {
    try {
        return this['throw'](new exceptions.GeneratorExit.$pyclass())
    } catch (e) {
        if (e instanceof exceptions.GeneratorExit.$pyclass ||
                e instanceof exceptions.StopIteration.$pyclass) {
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

/**************************************************
 * Module exports
 **************************************************/

module.exports = Generator
