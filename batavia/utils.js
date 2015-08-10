
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

if (!atob) {
    var atob = function (b64string) {
        return new Buffer(b64string, 'base64').toString('binary');
    };
}

/*************************************************************************
 * A Logger
 *************************************************************************/

function Logger() {
}

Logger.prototype.info = function(message) {
    console.log(message);
};

Logger.prototype.warning = function(message) {
    console.log('WARNING: ', message);
};

Logger.prototype.error = function(message) {
    console.log('ERROR: ', message);
};

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
    this.push.apply(this, values);
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
    this.add.apply(this, values);
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
