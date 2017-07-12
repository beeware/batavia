var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var callables = require('../core').callables

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
        var types = require('../types')
        if (!(value === null || types.isinstance(value, types.NoneType))) {
            // It's illegal to send a non-None value on first call.
            throw new exceptions.TypeError.$pyclass(
                "can't send non-None value to a just-started generator"
            )
        }
        this.started = true
    }
    if (this.finished) {
        throw new exceptions.StopIteration.$pyclass()
    }
    this.gi_frame.stack.push(value)
    var yieldval = this.vm.run_frame(this.gi_frame)
    if (this.finished) {
        throw new exceptions.StopIteration.$pyclass()
    }
    return yieldval
}

Generator.prototype['throw'] = function(ExcType, value, traceback) {
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
    return this['throw'](new exceptions.StopIteration.$pyclass())
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Generator
