
/*************************************************************************
 * A base Python object
 *************************************************************************/

batavia.types.Object = function() {
    function PyObject(args, kwargs) {
        Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    PyObject.prototype = Object.create(Object.prototype);

    return PyObject;
}();


/*************************************************************************
 * A Python type
 *************************************************************************/

batavia.types.Type = function() {
    function Type(name, bases, dict) {
        this.__name__ = name;
        if (bases) {
            this.__base__ = bases[0].prototype.__class__;
            this.__bases__ = [];
            for (var base = 0; base < bases.length; base++) {
                this.__bases__.push(bases[base].prototype.__class__);
            }
        } else if (name === 'object' && bases === undefined) {
            this.__base__ = null;
            this.__bases__ = [];
        } else {
            this.__base__ = batavia.types.Object.prototype.__class__;
            this.__bases__ = [batavia.types.Object.prototype.__class__];
        }
        this.dict = dict;
    }

    Type.prototype = Object.create(Object.prototype);
    Type.prototype.__class__ = new Type('type');

    Type.prototype.toString = function() {
        return this.__repr__();
    };

    Type.prototype.__repr__ = function() {
        // True primitive types won't have __bases__ defined.
        if (this.__bases__) {
            return "<class '" + this.__name__ + "'>";
        } else {
            return this.__name__;
        }
    };

    Type.prototype.__str__ = function() {
        return this.__repr__();
    };

    Type.prototype.valueOf = function() {
        return this.prototype;
    };

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
                this__mro__ = [this];
            }
        }
        return this.__mro__;
    };

    return Type;
}();

batavia.types.Object.prototype.__class__ = new batavia.types.Type('object');
