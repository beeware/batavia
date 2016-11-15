var pytypes = require('./Type');

module.exports = function() {
    var builtins = require('../core/builtins');

    function Generator(frame, vm) {
        pytypes.Object.call(this);

        this.vm = vm;
        this.gi_frame = frame;
        this.started = false;
        this.finished = false;
    };

    Generator.prototype = Object.create(Object.prototype);
    Generator.prototype.__class__ = new pytypes.Type('generator');

    Generator.prototype.__iter__ = function() {
        return this;
    }

    Generator.prototype.__next__ = function() {
        return this.send(null)
    }

    Generator.prototype.send = function(value) {
        if (typeof value === 'undefined') {
            value = null;
        }
        if (!this.started) {
            if (value !== null) {
                // It's illegal to send a non-None value on first call.
                // TODO: raise a proper TypeError
                throw 'lolnope'
            }
            this.started = true
        }
        this.gi_frame.stack.push(value);
        var yieldval = this.vm.run_frame(this.gi_frame)
        if (this.finished) {
            throw new builtins.StopIteration();
        }
        return yieldval;
    }

    Generator.prototype['throw'] = function(type, value, traceback) {
        this.vm.last_exception = {
            'exc_type': type,
            'value': value !== null ? value : new type(),
            'traceback': traceback
        }
        var yieldval = this.vm.run_frame(this.gi_frame)
        if (this.finished) {
            throw new builtins.StopIteration();
        }
        return yieldval;
    }

    Generator.prototype['close'] = function() {
        return this['throw'](new builtins.StopIteration());
    }

    return Generator;
}();
