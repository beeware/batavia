var exceptions = require('./exceptions');

var callables = {};

/*************************************************************************
 * callable construction
 *************************************************************************/

callables.run_callable = function(self, func, posargs, namedargs) {
    // Here you are in JS-land, and you want to call a method on an object
    // but what kind of callable is it?  You may not know if you were passed
    // the function as an argument.

    // TODO: consider separating these out, which might make things more
    //   efficient, but this at least consolidates the use-cases.

    // This gets the right js-callable thing, and runs it in the VirtualMachine.

    // There are a couple of scenarios:
    // 1. You *are* the virtual machine, and you want to call it:
    //    See VirtualMachine.prototype.call_function
    //    run_callable(<virtualmachine.is_vm=true>, <python method>, ...)
    //    i.e. run_callable(this, func, posargs, namedargs_dict)
    // 2. You are in a JS-implemented type, and the method or object is
    //    e.g. batavia/types/Map.js,Filter.js
    //    run_callable(<python_parent_obj>, <python_method (with func._vm)>, ...)
    //    If you are just passed an anonymous method:
    //    run_callable(<falsish>, <python_method (with func._vm)>, ...)
    // 3. You are in a builtin called by javascript and you also don't
    //    know the provenance of the object/function
    //    e.g. iter() called internally by types/Map.js
    //    see #2 scenario

    //the VM should pass itself in self, but if it already blessed
    //  a method with itself on ._vm just use that.
    var vm = (func._vm) ? func._vm : self;

    if (self && !self.is_vm && func.__python__ && !func.__self__) {
        // In scenarios 2,3 the VM would normally be doing this
        // at the moment of getting the function through LOAD_ATTR
        // but if we call it by JS, then it still needs to be
        // decorated with itself
        func = new types.Method(self, func);
        // Note, we change func above, so it can get __self__
        // and be affected by the code-path below
    }

    if ('__python__' in func && '__self__' in func) {
        // A python-style method
        // Methods calls get self as an implicit first parameter.
        if (func.__self__) {
            posargs.unshift(func.__self__);
        }

        // The first parameter must be the correct type.
        if (posargs[0] instanceof func.constructor) {
            throw 'unbound method ' + func.__func__.__name__ + '()' +
                ' must be called with ' + func.__class__.__name__ + ' instance ' +
                'as first argument (got ' + posargs[0].prototype + ' instance instead)';
        }
        func = func.__func__.__call__;
    } else if ('__call__' in func) {
        // A Python callable
        func = func.__call__;
    } else if (func.prototype) {
        // If this is a native Javascript class constructor, wrap it
        // in a method that uses the Python calling convention, but
        // instantiates the object.
        if (!func.__python__ && Object.keys(func.prototype).length > 0) {
            func = function(fn) {
                return function(args, kwargs) {
                    var obj = Object.create(fn.prototype);
                    fn.apply(obj, args);
                    return obj;
                };
            }(func);
        }
    }

    var retval = func.apply(vm, [posargs, namedargs]);
    return retval;
}


/************************
 * Working with iterables
 ************************/

// Iterate a python iterable to completion,
// calling a javascript callback on each item that it yields.
callables.iter_for_each = function(iterobj, callback) {
    try {
        while (true) {
            var next = callables.run_callable(iterobj, iterobj.__next__, [], null);
            callback(next);
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration)) {
            throw err;
        }
    }
}

module.exports = callables;
