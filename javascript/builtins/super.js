import { PyAttributeError, PyNotImplementedError, PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

function make_super(frame, type, obj) {
    // I guess we have to examine the stack to find out which class we are in?
    // this seems suboptimal...
    // what does CPython do?
    if (type !== undefined || obj !== undefined) {
        throw new PyNotImplementedError('super does not support arguments yet')
    }
    if (frame.f_code.co_name !== '__init__') {
        throw new PyNotImplementedError('super not implemented outside of __init__ yet')
    }
    if (frame.f_code.co_argcount === 0) {
        throw new PyTypeError('no self found in super in __init__')
    }
    var self_name = frame.f_code.co_varnames[0]
    var self = frame.f_locals[self_name]
    if (self.__bases__.length !== 1) {
        throw new PyNotImplementedError('super not implemented for multiple inheritance yet')
    }

    var base = self.__base__

    return {
        // __init__: base.__init__.bind(self);
        __getattribute__: function(name) {
            var attr = base[name]
            if (attr === undefined) {
                throw new PyAttributeError(
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
}

export default function super_(type, obj) {
    if (type !== undefined || obj !== undefined) {
        throw new PyNotImplementedError("Builtin Batavia function 'super' with arguments not implemented")
    }

    return make_super(this.frame, type, obj)
}

super_.__name__ = 'super'
super_.__doc__ = `super() -> same as super(__class__, <first argument>)
super(type) -> unbound super object
super(type, obj) -> bound super object; requires isinstance(obj, type)
super(type, type2) -> bound super object; requires issubclass(type2, type)
Typical use to call a cooperative superclass method:
class C(B):
    def meth(self, arg):
        super().meth(arg)
        This works for class methods too:
class C(B):
    @classmethod
    def cmeth(cls, arg):
        super().cmeth(arg)
`
super_.$pyargs = {
    defaultargs: ['type', 'obj']
}
