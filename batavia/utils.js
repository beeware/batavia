
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
            this['key'] = values[key];
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
