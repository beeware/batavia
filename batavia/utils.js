
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

String.prototype.startswith = function (str) {
    return this.slice(0, str.length) === str;
};

/*************************************************************************
 * Modify Object to behave like a Python Dictionary
 *************************************************************************/

Object.prototype.update = function(values) {
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
            this[key] = values[key];
        }
    }
};

/*************************************************************************
 * Modify Array to behave like a Python List
 *************************************************************************/

Array.prototype.append = function(value) {
    this.push(value);
};

Array.prototype.extend = function(values) {
    if (values.length > 0) {
        this.push.apply(this, values);
    }
};

/*************************************************************************
 * Subclass Object to provide a Set object
 *************************************************************************/

function Set(v) {
    Object.call(this, v);
}

Set.prototype = Object.create(Object.prototype);
Set.prototype.constructor = Set;

Set.prototype.add = function(v) {
    this[v] = null;
};

Set.prototype.remove = function(v) {
    delete this[v];
};

Set.prototype.update = function(values) {
    for (var value in values) {
        if (values.hasOwnProperty(value)) {
            this[values[value]] = null;
        }
    }
};

/*************************************************************************
 * An implementation of iter()
 *************************************************************************/

function iter(data) {
    // if data is already iterable, just return it.
    if (data.__next__) {
        return data;
    }
    return new Iterable(data);
}

function Iterable(data) {
    this.index = 0;
    this.data = data;
}

Iterable.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw "StopIteration";
    }
    this.index++;
    return retval;
};

function next(iterator) {
    return iterator.__next__();
}

/*************************************************************************
 * An implementation of range()
 *************************************************************************/

function _range(start, stop, step) {
    this.start = start;
    this.stop = stop;
    this.step = step || 1;

    if (this.stop === undefined) {
        this.start = 0;
        this.stop = start;
    }

    this.i = this.start;
}

_range.prototype.__next__ = function() {
    var retval = this.i;
    if (this.i < this.stop) {
        this.i = this.i + this.step;
        return retval;
    }
    throw "StopIteration";
};

function range(start, stop, step) {
    return new _range(start, stop, step);
}


/*************************************************************************
 * Operator defintions that match Python-like behavior.
 *************************************************************************/

batavia.operators = {
    // UNARY operators
    POSITIVE: function(a) {
        return +x;
    },
    NEGATIVE: function(a) {
        return -x;
    },
    NOT: function(a) {
        return !x;
    },
    CONVERT: function(a) {
        throw 'NotImplemented';
    },
    INVERT: function(a) {
        throw 'NotImplemented';
    },

    // BINARY/INPLACE operators
    POWER: function(a, b) {
        return Math.pow(a, b);
    },
    MULTIPLY: function(a, b) {
        var result, i;
        if (a instanceof Array) {
            result = [];
            if (b instanceof Array) {
                throw "TypeError";
            } else {
                for (i = 0; i < b; i++) {
                    result.extend(a);
                }
            }
        } else if (b instanceof Array) {
            result = [];
            if (a instanceof Array) {
                throw "TypeError";
            } else {
                for (i = 0; i < a; i++) {
                    result.extend(b);
                }
            }
        }
        else {
            result = a + b;
        }
        return result;
    },
    DIVIDE: function(a, b) {
        return Math.floor(a / b);
    },
    FLOOR_DIVIDE: function(a, b) {
        return Math.floor(a / b);
    },
    TRUE_DIVIDE: function(a, b) {
        return a / b;
    },
    MODULO: function(a, b) {
        return a % b;
    },
    ADD: function(a, b) {
        var result, i;
        if (a instanceof Array) {
            if (b instanceof Array) {
                result = [];
                result.extend(a);
                result.extend(b);
            } else {
                throw "TypeError";
            }
        } else if (b instanceof Array) {
            throw "TypeError";
        }
        else {
            result = a + b;
        }
        return result;
    },
    SUBTRACT: function(a, b) {
        return a - b;
    },
    SUBSCR: function(a, b) {
        if (b instanceof Object) {
            var start, stop, step, result;
            if (b.start === null) {
                start = 0;
            }
            if (b.stop === null) {
                stop = a.length;
            }
            if (b.step === 1) {
                result = a.slice(start, stop);
            } else {
                result = [];
                for (var i = start; i < stop; i += b.step) {
                    result.push(a[i]);
                }
            }
            return result;
        } else {
            return a[b];
        }
    },
    LSHIFT: function(a, b) {
        return a << b;
    },
    RSHIFT: function(a, b) {
        return a >> b;
    },
    AND: function(a, b) {
        return a & b;
    },
    XOR: function(a, b) {
        return a ^ b;
    },
    OR: function(a, b) {
        return a | b;
    },
};

batavia.comparisons = [
    function (x, y) {
        return x < y;
    },
    function (x, y) {
        return x <= y;
    },
    function (x, y) {
        return x == y;
    },
    function (x, y) {
        return x != y;
    },
    function (x, y) {
        return x > y;
    },
    function (x, y) {
        return x >= y;
    },
    function (x, y) {
        return x in y;
    },
    function (x, y) {
        return !(x in y);
    },
    function (x, y) {
        return x === y;
    },
    function (x, y) {
        return x !== y;
    },
    function (x, y) {
        return false;
    },
];

