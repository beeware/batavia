import { AttributeError, NotImplementedError, TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

function make_super(frame, args) {
    // I guess we have to examine the stack to find out which class we are in?
    // this seems suboptimal...
    // what does CPython do?
    if (args.length !== 0) {
        throw new NotImplementedError('super does not support arguments yet')
    }
    if (frame.f_code.co_name !== '__init__') {
        throw new NotImplementedError('super not implemented outside of __init__ yet')
    }
    if (frame.f_code.co_argcount === 0) {
        throw new TypeError('no self found in super in __init__')
    }
    var self_name = frame.f_code.co_varnames[0]
    var self = frame.f_locals[self_name]
    if (self.__bases__.length !== 1) {
        throw new NotImplementedError('super not implemented for multiple inheritance yet')
    }

    var base = self.__base__

    var obj = {
        // __init__: base.__init__.bind(self);
        __getattribute__: function(name) {
            var attr = base[name]
            if (attr === undefined) {
                throw new AttributeError(
                    "'" + type_name(self) + "' object has no attribute '" + name + "'"
                )
            }

            // If the returned object is a descriptor, invoke it.
            // Otherwise, the returned object *is* the value.
            var value
            if (attr.__get__ !== undefined) {
                value = attr.__get__(self)
            } else {
                value = attr
            }

            return value
        }
    }
    // obj.__init__.$pyargs = true;
    return obj
}

export default function super_(type, obj) {
    if (type !== undefined || obj !== undefined) {
        throw new NotImplementedError("Builtin Batavia function 'super' with arguments not implemented")
    }

    return make_super(this.frame, args)
}

super_.__doc__ = 'super() -> same as super(__class__, <first argument>)\nsuper(type) -> unbound super object\nsuper(type, obj) -> bound super object; requires isinstance(obj, type)\nsuper(type, type2) -> bound super object; requires issubclass(type2, type)\nTypical use to call a cooperative superclass method:\nclass C(B):\n    def meth(self, arg):\n        super().meth(arg)\nThis works for class methods too:\nclass C(B):\n    @classmethod\n    def cmeth(cls, arg):\n        super().cmeth(arg)\n'
super_.$pyargs = {
    defaultargs: [type, obj]
}
