var PyObject = require('./Object');

/*************************************************************************
 * A Python type
 *************************************************************************/
function Type(name, bases, dict) {
    this.__name__ = name;
    // TODO: we're kind of sloppy about if we are using an instance of the class or the class itself. We should really think this through. Especially in mro().
    if (bases && Array.isArray(bases)) {
        this.__base__ = bases[0].__class__;
        this.__bases__ = [];
        for (var base = 0; base < bases.length; base++) {
            this.__bases__.push(bases[base].__class__);
        }
    } else if (bases) {
        this.__base__ = bases.__class__;
        this.__bases__ = [this.__base__];
    } else if (name === 'object' && bases === undefined) {
        this.__base__ = null;
        this.__bases__ = [];
    } else {
        this.__base__ = PyObject.prototype.__class__;
        this.__bases__ = [PyObject.prototype.__class__];
    }
    this.dict = dict;
}

Type.prototype = Object.create(Object.prototype);
Type.prototype.__class__ = new Type('type');

Type.prototype.toString = function() {
    return this.__repr__();
}

Type.prototype.__repr__ = function() {
    // True primitive types won't have __bases__ defined.
    if (this.__bases__) {
        return "<class '" + this.__name__ + "'>";
    } else {
        return this.__name__;
    }
}

Type.prototype.__str__ = function() {
    return this.__repr__();
}

Type.prototype.valueOf = function() {
    return this.prototype;
}

Type.prototype.mro = function() {
    // Cache the MRO on the __mro__ attribute
    if (this.__mro__ === undefined) {
        // Self is always the first port of call for the MRO
        this.__mro__ = [this];
        if (this.__bases__) {
            // Now traverse and add the base classes.
            for (var b in this.__bases__) {
                this.__mro__.push(this.__bases__[b]);
                var submro = this.__bases__[b].mro();
                for (var sub in submro) {
                    // If the base class is already in the MRO,
                    // push it to the end of the MRO list.
                    var index = this.__mro__.indexOf(submro[sub]);
                    if (index !== -1) {
                        this.__mro__.splice(index, 1);
                    }
                    this.__mro__.push(submro[sub]);
                }
            }
        } else {
            // Primitives have no base class;
            this.__mro__ = [this];
        }
    }
    return this.__mro__;
}

// Set the type properties of the PyObject class
PyObject.__class__ = new Type('object');
PyObject.prototype.__class__ = PyObject.__class__;

/*************************************************************************
 * Method for outputting the type of a variable
 *************************************************************************/

var type_name = function(arg) {
    switch (typeof arg) {
        case 'boolean':
            return 'bool';
        case 'number':
            return 'Native number';
        case 'string':
            return 'str';
        case 'object':
        case 'function':
            if (arg.__class__ != null && arg.__class__.__name__) {
                return arg.__class__.__name__;
            }
    }

    return 'Native object';
}


module.exports = {
    'Type': Type,
    'type_name': type_name
}
