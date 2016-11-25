var exceptions = require('../core').exceptions;
var callables = require('../core').callables;

make_super = function(frame, args) {
    // I guess we have to examine the stack to find out which class we are in?
    // this seems suboptimal...
    // what does CPython do?
    if (args.length != 0) {
        throw new exceptions.NotImplementedError("super does not support arguments yet")
    }
    if (frame.f_code.co_name != '__init__') {
        throw new exceptions.NotImplementedError("super not implemented outside of __init__ yet");
    }
    if (frame.f_code.co_argcount == 0) {
        throw new exceptions.TypeError("no self found in super in __init__");
    }
    var self_name = frame.f_code.co_varnames[0];
    var self = frame.f_locals[self_name];
    var klass = self.__class__;
    if (klass.__bases__.length != 1) {
        throw new exceptions.NotImplementedError("super not implemented for multiple inheritance yet");
    }

    var base = klass.__base__;

    var obj = {
        '__init__': function(args, kwargs) {
            return callables.run_callable(self, base.__init__, args, kwargs);
        }
    };
    obj.__init__.__python__ = true;
    return obj;
};


var super_ = function(args, kwargs) {
    if (args.length > 0) {
        throw new exceptions.NotImplementedError("Builtin Batavia function 'super' with arguments not implemented");
    }

    return make_super(this.frame, args);
};
super_.__doc__ = 'super() -> same as super(__class__, <first argument>)\nsuper(type) -> unbound super object\nsuper(type, obj) -> bound super object; requires isinstance(obj, type)\nsuper(type, type2) -> bound super object; requires issubclass(type2, type)\nTypical use to call a cooperative superclass method:\nclass C(B):\n    def meth(self, arg):\n        super().meth(arg)\nThis works for class methods too:\nclass C(B):\n    @classmethod\n    def cmeth(cls, arg):\n        super().cmeth(arg)\n';

module.exports = super_;
