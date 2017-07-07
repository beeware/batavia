var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

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
    if (typeof value === 'undefined') {
        value = null
    }
    if (!this.started) {
        if (value !== null) {
            // It's illegal to send a non-None value on first call.
            throw new exceptions.TypeError.$pyclass(
                "can't send non-None value to a just-started generator"
            )
        }
        this.started = true
    }
    this.gi_frame.stack.push(value)
    var yieldval = this.vm.run_frame(this.gi_frame)
    if (this.finished) {
        throw new exceptions.StopIteration.$pyclass()
    }
    return yieldval
}

Generator.prototype['throw'] = function(ExcType, value, traceback) {
    if (value === null) {
        value = new ExcType()
    }
    this.vm.last_exception = {
        'exc_type': ExcType,
        'value': value,
        'traceback': traceback
    }
    var yieldval = this.vm.run_frame(this.gi_frame)
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
