import { PyRuntimeError, PyTypeError } from '../core/exceptions'
import * as types from '../types'

export var inspect = {
    '__doc__': '',
    '__file__': 'batavia/modules/inspect.js',
    '__name__': 'inspect',
    '__package__': '',

    'CO_OPTIMIZED': 0x1,
    'CO_NEWLOCALS': 0x2,
    'CO_VARARGS': 0x4,
    'CO_VARKEYWORDS': 0x8,
    'CO_NESTED': 0x10,
    'CO_GENERATOR': 0x20,
    'CO_NOFREE': 0x40
}

inspect.FullArgSpec = function(kwargs) {
    this.args = kwargs.args || []
    this.varargs = kwargs.getcallargs
    this.varkw = kwargs.varkw
    this.defaults = kwargs.defaults || {}
    this.kwonlyargs = kwargs.kwonlyargs || []
    this.kwonlydefaults = kwargs.kwonlydefaults || {}
    this.annotations = kwargs.annotations || {}
}

// inspect._signature_get_user_defined_method = function(cls, method_name) {
// try:
//     meth = getattr(cls, method_name)
// catch (err) {
//     return
// }
// else {
//     if not isinstance(meth, _NonUserDefinedCallables) {
//         // # Once '__signature__' will be added to 'C'-level
//         // callables, this check won't be necessary
//         return meth
//     }
// }
// }

// inspect._signature_bound_method = function(sig) {
//     // Internal helper to transform signatures for unbound
//     // functions to bound methods

//     var params = sig.parameters.values()

//     if (!params || params[0].kind in (_VAR_KEYWORD, _KEYWORD_ONLY)) {
//         throw new PyValueError('invalid method signature')
//     }

//     var kind = params[0].kind
//     if (kind in (_POSITIONAL_OR_KEYWORD, _POSITIONAL_ONLY)) {
//         // Drop first parameter:
//         // '(p1, p2[, ...])' -> '(p2[, ...])'
//         params = params.slice(1)
//     } else {
//         if (kind !== _VAR_POSITIONAL) {
//             // Unless we add a new parameter type we never
//             // get here
//             throw new PyValueError('invalid argument type')
//         }
//         // It's a var-positional parameter.
//         // Do nothing. '(*args[, ...])' -> '(*args[, ...])'
//     }

//     return sig.replace(parameters = params)
// }

inspect._signature_internal = function(obj, follow_wrapper_chains, skip_bound_arg) {
    // if (!callable(obj)) {
    //     throw PyTypeError('{!r} is not a callable object'.format(obj));
    // }

    // if (isinstance(obj, types.PyMethodType)) {
    // In this case we skip the first parameter of the underlying
    // function (usually `self` or `cls`).
    // sig = inspect._signature_internal(obj.__func__, follow_wrapper_chains, skip_bound_arg);
    // if (skip_bound_arg) {
    //     return inspect._signature_bound_method(sig);
    // } else {
    //     return sig;
    // }
    // }

    // // Was this function wrapped by a decorator?
    // if (follow_wrapper_chains) {
    //     obj = unwrap(obj, stop=function(f) { return hasattr(f, "__signature__"); });
    // }

    // try {
    //     sig = obj.__signature__;
    // } catch (err) {
    // } else {
    //     if (sig !== null) {
    //         if (!isinstance(sig, Signature)) {
    //             throw PyTypeError(
    //                 'unexpected object {!r} in __signature__ ' +
    //                 'attribute'.format(sig));
    //         }
    //         return sig;
    //     }
    // }
    // try {
    //     partialmethod = obj._partialmethod
    // } catch (err) {
    //     pass
    // } else {
    //     if isinstance(partialmethod, functools.partialmethod):
    //         // Unbound partialmethod (see functools.partialmethod)
    //         // This means, that we need to calculate the signature
    //         // as if it's a regular partial object, but taking into
    //         // account that the first positional argument
    //         // (usually `self`, or `cls`) will not be passed
    //         // automatically (as for boundmethods)

    //         wrapped_sig = inspect._signature_internal(partialmethod.func,
    //                                           follow_wrapper_chains,
    //                                           skip_bound_arg)
    //         sig = inspect._signature_get_partial(wrapped_sig, partialmethod, (None,))

    //         first_wrapped_param = tuple(wrapped_sig.parameters.values())[0]
    //         new_params = (first_wrapped_param,) + tuple(sig.parameters.values())

    //         return sig.replace(parameters=new_params)

    // if isfunction(obj) or _signature_is_functionlike(obj):
    //     # If it's a pure Python function, or an object that is duck type
    //     # of a Python function (Cython functions, for instance), then:
    return inspect.Signature.from_function(obj)

    // if _signature_is_builtin(obj):
    //     return inspect._signature_from_builtin(Signature, obj,
    //                                    skip_bound_arg=skip_bound_arg)

    // if isinstance(obj, functools.partial):
    //     wrapped_sig = inspect._signature_internal(obj.func,
    //                                       follow_wrapper_chains,
    //                                       skip_bound_arg)
    //     return inspect._signature_get_partial(wrapped_sig, obj)

    // sig = None
    // if isinstance(obj, type):
    //     // obj is a class or a metaclass

    //     // First, let's see if it has an overloaded __call__ defined
    //     // in its metaclass
    //     call = inspect._signature_get_user_defined_method(type(obj), '__call__')
    //     if call is not None:
    //         sig = inspect._signature_internal(call,
    //                                   follow_wrapper_chains,
    //                                   skip_bound_arg)
    //     else:
    //         # Now we check if the 'obj' class has a '__new__' method
    //         new = _signature_get_user_defined_method(obj, '__new__')
    //         if new is not None:
    //             sig = inspect._signature_internal(new,
    //                                       follow_wrapper_chains,
    //                                       skip_bound_arg)
    //         else:
    //             # Finally, we should have at least __init__ implemented
    //             init = _signature_get_user_defined_method(obj, '__init__')
    //             if init is not None:
    //                 sig = inspect._signature_internal(init,
    //                                           follow_wrapper_chains,
    //                                           skip_bound_arg)

    //     if sig is None:
    //         # At this point we know, that `obj` is a class, with no user-
    //         # defined '__init__', '__new__', or class-level '__call__'

    //         for base in obj.__mro__[:-1]:
    //             # Since '__text_signature__' is implemented as a
    //             # descriptor that extracts text signature from the
    //             # class docstring, if 'obj' is derived from a builtin
    //             # class, its own '__text_signature__' may be 'None'.
    //             # Therefore, we go through the MRO (except the last
    //             # class in there, which is 'object') to find the first
    //             # class with non-empty text signature.
    //             try:
    //                 text_sig = base.__text_signature__
    //             except PyAttributeError:
    //                 pass
    //             else:
    //                 if text_sig:
    //                     # If 'obj' class has a __text_signature__ attribute:
    //                     # return a signature based on it
    //                     return _signature_fromstr(Signature, obj, text_sig)

    //         # No '__text_signature__' was found for the 'obj' class.
    //         # Last option is to check if its '__init__' is
    //         # object.__init__ or type.__init__.
    //         if type not in obj.__mro__:
    //             # We have a class (not metaclass), but no user-defined
    //             # __init__ or __new__ for it
    //             if obj.__init__ is object.__init__:
    //                 # Return a signature of 'object' builtin.
    //                 return signature(object)

    // elif not isinstance(obj, _NonUserDefinedCallables):
    //     # An object with __call__
    //     # We also check that the 'obj' is not an instance of
    //     # _WrapperDescriptor or _MethodWrapper to avoid
    //     # infinite recursion (and even potential segfault)
    //     call = _signature_get_user_defined_method(type(obj), '__call__')
    //     if call is not None:
    //         try:
    //             sig = _signature_internal(call,
    //                                       follow_wrapper_chains,
    //                                       skip_bound_arg)
    //         except PyValueError as ex:
    //             msg = 'no signature found for {!r}'.format(obj)
    //             raise PyValueError(msg) from ex

    // if sig is not None:
    //     # For classes and objects we skip the first parameter of their
    //     # __call__, __new__, or __init__ methods
    //     if skip_bound_arg:
    //         return _signature_bound_method(sig)
    //     else:
    //         return sig

    // if isinstance(obj, types.PyBuiltinFunctionType):
    //     # Raise a nicer error message for builtins
    //     msg = 'no signature found for builtin function {!r}'.format(obj)
    //     raise PyValueError(msg)

    // raise PyValueError('callable {!r} is not supported by signature'.format(obj))
}

/*
 * Get the names and default values of a callable object's arguments.
 *
 * A tuple of seven things is returned:
 * (args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults annotations).
 * 'args' is a list of the argument names.
 * 'varargs' and 'varkw' are the names of the * and ** arguments or None.
 * 'defaults' is an n-tuple of the default values of the last n arguments.
 * 'kwonlyargs' is a list of keyword-only argument names.
 * 'kwonlydefaults' is a dictionary mapping names from kwonlyargs to defaults.
 * 'annotations' is a dictionary mapping argument names to annotations.
 *
 * The first four items in the tuple correspond to getargspec().
 */
inspect.getfullargspec = function(func) {
    // try {
    // Re: `skip_bound_arg=false`
    //
    // There is a notable difference in behaviour between getfullargspec
    // and Signature: the former always returns 'self' parameter for bound
    // methods, whereas the Signature always shows the actual calling
    // signature of the passed object.
    //
    // To simulate this behaviour, we "unbind" bound methods, to trick
    // inspect.signature to always return their first parameter ("self",
    // usually)

    // Re: `follow_wrapper_chains=false`
    //
    // getfullargspec() historically ignored __wrapped__ attributes,
    // so we ensure that remains the case in 3.3+

    var sig = inspect._signature_internal(func, false, false)

    var args = []
    var varargs = null
    var varkw = null
    var kwonlyargs = []
    var defaults = []
    var annotations = {}
    var kwdefaults = {}

    if (sig.return_annotation.length > 0) {
        annotations['return'] = sig.return_annotation
    }

    for (var p in sig.parameters) {
        if (sig.parameters.hasOwnProperty(p)) {
            var param = sig.parameters[p]

            if (param.kind === inspect.Parameter.POSITIONAL_ONLY) {
                args.push(param.name)
            } else if (param.kind === inspect.Parameter.POSITIONAL_OR_KEYWORD) {
                args.push(param.name)
                if (param.default !== undefined) {
                    defaults.push(param.default)
                }
            } else if (param.kind === inspect.Parameter.VAR_POSITIONAL) {
                varargs = param.name
            } else if (param.kind === inspect.Parameter.KEYWORD_ONLY) {
                kwonlyargs.push(param.name)
                if (param.default !== undefined) {
                    kwdefaults[param.name] = param.default
                }
            } else if (param.kind === inspect.Parameter.VAR_KEYWORD) {
                varkw = param.name
            }

            if (param.annotation !== undefined) {
                annotations[param.name] = param.annotation
            }
        }
    }

    if (kwdefaults.length === 0) {
        // compatibility with 'func.__kwdefaults__'
        kwdefaults = null
    }

    if (defaults.length === 0) {
        // compatibility with 'func.__defaults__'
        defaults = null
    }

    return new inspect.FullArgSpec({
        'args': args,
        'varargs': varargs,
        'varkw': varkw,
        'defaults': defaults,
        'kwonlyargs': kwonlyargs,
        'kwdefaults': kwdefaults,
        'annotations': annotations
    })

    // } catch (ex) {
    // Most of the times 'signature' will raise PyValueError.
    // But, it can also raise PyAttributeError, and, maybe something
    // else. So to be fully backwards compatible, we catch all
    // possible exceptions here, and reraise a PyTypeError.
    // raise PyTypeError('unsupported callable') from ex
    // throw PyTypeError('unsupported callable');
    // }
}

inspect._missing_arguments = function(f_name, argnames, pos, values) {
    throw PyRuntimeError('Missing arguments')
    // var names = [];
    // for (var name in argnames) {
    //     if (!name in values) {
    //         names.push(name);
    //     }
    // }
    // var missing = names.length;
    // if (missing === 1) {
    //     s = names[0];
    // } else if (missing === 2) {
    //     s = "{} and {}".format(*names)
    // } else {
    //     tail = ", {} and {}".format(*names[-2:])
    //     del names[-2:]
    //     s = ", ".join(names) + tail
    // }
    // raise PyTypeError("%s() missing %i required %s argument%s: %s" %
    //                 (f_name, missing,
    //                   "positional" if pos else "keyword-only",
    //                   "" if missing === 1 else "s", s))
}

inspect._too_many = function(f_name, args, kwonly, varargs, defcount, given, values) {
    throw PyRuntimeError('FIXME: Too many arguments')
    // atleast = len(args) - defcount
    // kwonly_given = len([arg for arg in kwonly if arg in values])
    // if varargs:
    //     plural = atleast !== 1
    //     sig = "at least %d" % (atleast,)
    // elif defcount:
    //     plural = True
    //     sig = "from %d to %d" % (atleast, len(args))
    // else:
    //     plural = len(args) !== 1
    //     sig = str(len(args))
    // kwonly_sig = ""
    // if kwonly_given:
    //     msg = " positional argument%s (and %d keyword-only argument%s)"
    //     kwonly_sig = (msg % ("s" if given !== 1 else "", kwonly_given,
    //                          "s" if kwonly_given !== 1 else ""))
    // raise PyTypeError("%s() takes %s positional argument%s but %d%s %s given" %
    //         (f_name, sig, "s" if plural else "", given, kwonly_sig,
    //          "was" if given === 1 and not kwonly_given else "were"))
}

/*
 * Get the mapping of arguments to values.
 *
 * A dict is returned, with keys the function argument names (including the
 * names of the * and ** arguments, if any), and values the respective bound
 * values from 'positional' and 'named'.
 */
inspect.getcallargs = function(func, positional, named) {
    var arg2value = new types.JSDict()

    // if ismethod(func) and func.__self__ is not None:
    if (func.__self__) {
        // implicit 'self' (or 'cls' for classmethods) argument
        positional = [func.__self__].concat(positional)
    }
    var num_pos = positional.length
    var num_args = func.argspec.args.length
    var num_defaults
    if (func.argspec.defaults) {
        num_defaults = func.argspec.defaults.length
    } else {
        num_defaults = 0
    }

    var i, arg
    var n = Math.min(num_pos, num_args)
    for (i = 0; i < n; i++) {
        arg2value[func.argspec.args[i]] = positional[i]
    }

    if (func.argspec.varargs) {
        arg2value[func.argspec.varargs] = positional.slice(n)
    }

    var possible_kwargs = new types.PySet()
    possible_kwargs.update(func.argspec.args)
    possible_kwargs.update(func.argspec.kwonlyargs)

    if (func.argspec.varkw) {
        arg2value[func.argspec.varkw] = {}
    }

    for (var kw in named) {
        if (named.hasOwnProperty(kw)) {
            if (!possible_kwargs.__contains__(new types.PyStr(kw)).valueOf()) {
                if (!func.argspec.varkw) {
                    throw new PyTypeError('%s() got an unexpected keyword argument %r' %
                                (func.__name__, kw))
                }
                arg2value[func.argspec.varkw][kw] = named[kw]
                continue
            }
            if (kw in arg2value) {
                throw new PyTypeError('%s() got multiple values for argument %r' %
                                (func.__name__, kw))
            }
            arg2value[kw] = named[kw]
        }
    }

    if (num_pos > num_args && (func.argspec.varargs === undefined || func.argspec.varargs.length === 0)) {
        inspect._too_many(func.__name__, func.argspec.args, func.argspec.kwonlyargs, func.argspec.varargs, num_defaults, num_pos, arg2value)
    }
    if (num_pos < num_args) {
        var req = func.argspec.args.slice(0, num_args - num_defaults)
        for (arg in req) {
            if (req.hasOwnProperty(arg)) {
                if (!(req[arg] in arg2value)) {
                    inspect._missing_arguments(func.__name__, req, true, arg2value)
                }
            }
        }
        for (i = num_args - num_defaults; i < func.argspec.args.length; i++) {
            arg = func.argspec.args[i]
            if (!arg2value.hasOwnProperty(arg)) {
                arg2value[arg] = func.argspec.defaults[i - num_pos]
            }
        }
    }
    var missing = 0
    for (var kwarg in func.argspec.kwonlyargs) {
        if (func.argspec.kwonlydefaults.hasOwnProperty(kwarg)) {
            if (!arg2value.hasOwnProperty(kwarg)) {
                if (func.argspec.kwonlydefaults.hasOwnProperty(kwarg)) {
                    arg2value[kwarg] = func.argspec.kwonlydefaults[kwarg]
                } else {
                    missing += 1
                }
            }
        }
    }
    if (missing) {
        inspect._missing_arguments(func.__name__, func.argspec.kwonlyargs, false, arg2value)
    }
    return arg2value
}

/*
Represents a parameter in a function signature.

Has the following public attributes:

* name : str
The name of the parameter as a string.
* default : object
The default value for the parameter if specified.  If the
parameter has no default value, this attribute is set to
`Parameter.empty`.
* annotation
The annotation for the parameter if specified.  If the
parameter has no annotation, this attribute is set to
`Parameter.empty`.
* kind : str
Describes how argument values are bound to the parameter.
Possible values: `Parameter.POSITIONAL_ONLY`,
`Parameter.POSITIONAL_OR_KEYWORD`, `Parameter.VAR_POSITIONAL`,
`Parameter.KEYWORD_ONLY`, `Parameter.VAR_KEYWORD`.
*/
inspect.Parameter = function(kwargs) {
    this.name = kwargs.name
    this.kind = kwargs.kind
    this.annotation = kwargs.annotation
    this.default = kwargs.default

    // if kind not in (POSITIONAL_ONLY, _POSITIONAL_OR_KEYWORD,
    //                 _VAR_POSITIONAL, _KEYWORD_ONLY, _VAR_KEYWORD):
    //     raise PyValueError("invalid value for 'Parameter.kind' attribute")

    // if def is not _empty:
    //     if kind in (_VAR_POSITIONAL, _VAR_KEYWORD):
    //         msg = '{} parameters cannot have def values'.format(kind)
    //         raise PyValueError(msg)

    // if name is _empty:
    //     raise PyValueError('name is a required attribute for Parameter')

    // if not isinstance(name, str):
    //     raise PyTypeError("name must be a str, not a {!r}".format(name))

    // if not name.isidentifier():
    //     raise PyValueError('{!r} is not a valid parameter name'.format(name))
}

inspect.Parameter.POSITIONAL_ONLY = 0
inspect.Parameter.POSITIONAL_OR_KEYWORD = 1
inspect.Parameter.VAR_POSITIONAL = 2
inspect.Parameter.KEYWORD_ONLY = 3
inspect.Parameter.VAR_KEYWORD = 4

//    '''Creates a customized copy of the Parameter.'''
inspect.Parameter.prototype.replace = function(kwargs) {
    var name = kwargs.name || this.name
    var kind = kwargs.kind || this.kind
    var annotation = kwargs.annotation || this.annotation
    var def = kwargs.default || this.default

    return new inspect.Paramter(name, kind, def, annotation)
}

// def __str__(self):
//     kind = self.kind
//     formatted = self._name

//     # Add annotation and default value
//     if self._annotation is not _empty:
//         formatted = '{}:{}'.format(formatted,
//                                    formatannotation(self._annotation))

//     if self._default is not _empty:
//         formatted = '{}={}'.format(formatted, repr(self._default))

//     if kind === _VAR_POSITIONAL:
//         formatted = '*' + formatted
//     elif kind === _VAR_KEYWORD:
//         formatted = '**' + formatted

//     return formatted

// def __repr__(self):
//     return '<{} at {:#x} {!r}>'.format(self.__class__.__name__,
//                                        id(self), self.name)

// def __eq__(self, other):
//     return (issubclass(other.__class__, Parameter) and
//             self._name === other._name and
//             self._kind === other._kind and
//             self._default === other._default and
//             self._annotation === other._annotation)

// def __ne__(self, other):
//     return not self.__eq__(other)

// class BoundArguments:
//     '''Result of `Signature.bind` call.  Holds the mapping of arguments
//     to the function's parameters.

//     Has the following public attributes:

//     * arguments : OrderedDict
//         An ordered mutable mapping of parameters' names to arguments' values.
//         Does not contain arguments' default values.
//     * signature : Signature
//         The Signature object that created this instance.
//     * args : tuple
//         Tuple of positional arguments values.
//     * kwargs : dict
//         Dict of keyword arguments values.
//     '''

//     def __init__(self, signature, arguments):
//         self.arguments = arguments
//         self._signature = signature

//     @property
//     def signature(self):
//         return self._signature

//     @property
//     def args(self):
//         args = []
//         for param_name, param in self._signature.parameters.items():
//             if param.kind in (_VAR_KEYWORD, _KEYWORD_ONLY):
//                 break

//             try:
//                 arg = self.arguments[param_name]
//             except PyKeyError:
//                 # We're done here. Other arguments
//                 # will be mapped in 'BoundArguments.kwargs'
//                 break
//             else:
//                 if param.kind === _VAR_POSITIONAL:
//                     # *args
//                     args.extend(arg)
//                 else:
//                     # plain argument
//                     args.push(arg)

//         return tuple(args)

//     @property
//     def kwargs(self):
//         kwargs = {}
//         kwargs_started = False
//         for param_name, param in self._signature.parameters.items():
//             if not kwargs_started:
//                 if param.kind in (_VAR_KEYWORD, _KEYWORD_ONLY):
//                     kwargs_started = True
//                 else:
//                     if param_name not in self.arguments:
//                         kwargs_started = True
//                         continue

//             if not kwargs_started:
//                 continue

//             try:
//                 arg = self.arguments[param_name]
//             except PyKeyError:
//                 pass
//             else:
//                 if param.kind === _VAR_KEYWORD:
//                     # **kwargs
//                     kwargs.update(arg)
//                 else:
//                     # plain keyword argument
//                     kwargs[param_name] = arg

//         return kwargs

//     def __eq__(self, other):
//         return (issubclass(other.__class__, BoundArguments) and
//                 self.signature === other.signature and
//                 self.arguments === other.arguments)

//     def __ne__(self, other):
//         return not self.__eq__(other)

/*
 * A Signature object represents the overall signature of a function.
It stores a Parameter object for each parameter accepted by the
function, as well as information specific to the function itself.

A Signature object has the following public attributes and methods:

* parameters : OrderedDict
    An ordered mapping of parameters' names to the corresponding
    Parameter objects (keyword-only arguments are in the same order
    as listed in `code.co_varnames`).
* return_annotation : object
    The annotation for the return type of the function if specified.
    If the function has no annotation for its return type, this
    attribute is set to `Signature.empty`.
* bind(*args, **kwargs) -> BoundArguments
    Creates a mapping from positional and keyword arguments to
    parameters.
* bind_partial(*args, **kwargs) -> BoundArguments
    Creates a partial mapping from positional and keyword arguments
    to parameters (simulating 'functools.partial' behavior.)
*/
/* Constructs Signature from the given list of Parameter
* objects and 'return_annotation'.  All arguments are optional.
*/
inspect.Signature = function(parameters, return_annotation, __validate_parameters__) {
    this.parameters = {}
    if (parameters !== null) {
        if (__validate_parameters__) {
            // params = OrderedDict()
            // top_kind = _POSITIONAL_ONLY
            // kind_defaults = false

            // for idx, param in enumerate(parameters):
            //     kind = param.kind
            //     name = param.name

            //     if kind < top_kind:
            //         msg = 'wrong parameter order: {!r} before {!r}'
            //         msg = msg.format(top_kind, kind)
            //         raise PyValueError(msg)
            //     elif kind > top_kind:
            //         kind_defaults = false
            //         top_kind = kind

            //     if kind in (_POSITIONAL_ONLY, _POSITIONAL_OR_KEYWORD):
            //         if param.default is _empty:
            //             if kind_defaults:
            //                 # No default for this parameter, but the
            //                 # previous parameter of the same kind had
            //                 # a default
            //                 msg = 'non-default argument follows default ' \
            //                       'argument'
            //                 raise PyValueError(msg)
            //         else:
            //             # There is a default for this parameter.
            //             kind_defaults = True

            //     if name in params:
            //         msg = 'duplicate parameter name: {!r}'.format(name)
            //         raise PyValueError(msg)

            //     params[name] = param
        } else {
            // params = OrderedDict(((param.name, param) for param in parameters));
            for (var p in parameters) {
                if (parameters.hasOwnProperty(p)) {
                    this.parameters[parameters[p].name] = parameters[p]
                }
            }
        }
    }

    this.return_annotation = return_annotation
}

// inspect.Signature._parameter_cls = Parameter;
// inspect.Signature._bound_arguments_cls = BoundArguments;

/*
* Constructs Signature for the given python function
*/
inspect.Signature.from_function = function(func) {
    var is_duck_function = false
    // if (!isfunction(func)) {
    //     if (_signature_is_functionlike(func)) {
    //         is_duck_function = true;
    //     } else {
    //         // If it's not a pure Python function, and not a duck type
    //         // of pure function:
    //         throw PyTypeError('{!r} is not a Python function'.format(func));
    //     }
    // }

    // Parameter = cls._parameter_cls

    // Parameter information.
    var func_code = func.__code__
    var pos_count = func_code.co_argcount
    var arg_names = func_code.co_varnames
    var positional = arg_names.slice(0, pos_count)
    var keyword_only_count = func_code.co_kwonlyargcount
    var keyword_only = arg_names.slice(pos_count, pos_count + keyword_only_count)
    var annotations = func.__annotations__
    var defs = func.__defaults__
    var kwdefaults = func.__kwdefaults__

    var pos_default_count
    if (defs) {
        pos_default_count = defs.length
    } else {
        pos_default_count = 0
    }

    var parameters = []
    var n, name, annotation, def, offset

    // Non-keyword-only parameters w/o defaults.
    var non_default_count = pos_count - pos_default_count
    for (n = 0; n < non_default_count; n++) {
        name = positional[n]
        annotation = annotations[name]
        parameters.push(new inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': inspect.Parameter.POSITIONAL_OR_KEYWORD
        }))
    }

    // ... w/ defaults.
    for (offset = 0, n = non_default_count; n < positional.length; offset++, n++) {
        name = positional[n]
        annotation = annotations[name]
        parameters.push(new inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': inspect.Parameter.POSITIONAL_OR_KEYWORD,
            'default': defs[offset]
        }))
    }

    // *args
    if (func_code.co_flags & inspect.CO_VARARGS) {
        name = arg_names[pos_count + keyword_only_count]
        annotation = annotations[name]
        parameters.push(new inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': inspect.Parameter.VAR_POSITIONAL
        }))
    }

    // Keyword-only parameters.
    for (n = 0; n < keyword_only.length; n++) {
        def = null
        if (kwdefaults !== null) {
            def = kwdefaults[name]
        }

        annotation = annotations[name]
        parameters.push(new inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': inspect.Parameter.KEYWORD_ONLY,
            'default': def
        }))
    }

    // **kwargs
    if (func_code.co_flags & inspect.CO_VARKEYWORDS) {
        var index = pos_count + keyword_only_count
        if (func_code.co_flags & inspect.CO_VARARGS) {
            index += 1
        }

        name = arg_names[index]
        annotation = annotations[name]
        parameters.push(new inspect.Parameter({
            'name': name,
            'annotation': annotation,
            'kind': inspect.Parameter.VAR_KEYWORD
        }))
    }

    // Is 'func' is a pure Python function - don't validate the
    // parameters list (for correct order and defaults), it should be OK.
    return new inspect.Signature(parameters, annotations['return'] || {}, is_duck_function)
}

// @classmethod
// def from_builtin(cls, func):
//     return _signature_from_builtin(cls, func)

// def replace(self, *, parameters=_void, return_annotation=_void):
//     '''Creates a customized copy of the Signature.
//     Pass 'parameters' and/or 'return_annotation' arguments
//     to override them in the new copy.
//     '''

//     if parameters is _void:
//         parameters = self.parameters.values()

//     if return_annotation is _void:
//         return_annotation = self._return_annotation

//     return type(self)(parameters,
//                       return_annotation=return_annotation)

// def __eq__(self, other):
//     if (not issubclass(type(other), Signature) or
//                 self.return_annotation !== other.return_annotation or
//                 len(self.parameters) !== len(other.parameters)):
//         return false

//     other_positions = {param: idx
//                        for idx, param in enumerate(other.parameters.keys())}

//     for idx, (param_name, param) in enumerate(self.parameters.items()):
//         if param.kind === _KEYWORD_ONLY:
//             try:
//                 other_param = other.parameters[param_name]
//             except PyKeyError:
//                 return false
//             else:
//                 if param !== other_param:
//                     return false
//         else:
//             try:
//                 other_idx = other_positions[param_name]
//             except PyKeyError:
//                 return false
//             else:
//                 if (idx !== other_idx or
//                                 param !== other.parameters[param_name]):
//                     return false

//     return True

// def __ne__(self, other):
//     return not self.__eq__(other)

// def _bind(self, args, kwargs, *, partial=false):
//     '''Private method.  Don't use directly.'''

//     arguments = OrderedDict()

//     parameters = iter(self.parameters.values())
//     parameters_ex = ()
//     arg_vals = iter(args)

//     while True:
//         # Let's iterate through the positional arguments and corresponding
//         # parameters
//         try:
//             arg_val = next(arg_vals)
//         except PyStopIteration:
//             # No more positional arguments
//             try:
//                 param = next(parameters)
//             except PyStopIteration:
//                 # No more parameters. That's it. Just need to check that
//                 # we have no `kwargs` after this while loop
//                 break
//             else:
//                 if param.kind === _VAR_POSITIONAL:
//                     # That's OK, just empty *args.  Let's start parsing
//                     # kwargs
//                     break
//                 elif param.name in kwargs:
//                     if param.kind === _POSITIONAL_ONLY:
//                         msg = '{arg!r} parameter is positional only, ' \
//                               'but was passed as a keyword'
//                         msg = msg.format(arg=param.name)
//                         raise PyTypeError(msg) from None
//                     parameters_ex = (param,)
//                     break
//                 elif (param.kind === _VAR_KEYWORD or
//                                             param.default is not _empty):
//                     # That's fine too - we have a default value for this
//                     # parameter.  So, lets start parsing `kwargs`, starting
//                     # with the current parameter
//                     parameters_ex = (param,)
//                     break
//                 else:
//                     # No default, not VAR_KEYWORD, not VAR_POSITIONAL,
//                     # not in `kwargs`
//                     if partial:
//                         parameters_ex = (param,)
//                         break
//                     else:
//                         msg = '{arg!r} parameter lacking default value'
//                         msg = msg.format(arg=param.name)
//                         raise PyTypeError(msg) from None
//         else:
//             # We have a positional argument to process
//             try:
//                 param = next(parameters)
//             except PyStopIteration:
//                 raise PyTypeError('too many positional arguments') from None
//             else:
//                 if param.kind in (_VAR_KEYWORD, _KEYWORD_ONLY):
//                     # Looks like we have no parameter for this positional
//                     # argument
//                     raise PyTypeError('too many positional arguments')

//                 if param.kind === _VAR_POSITIONAL:
//                     # We have an '*args'-like argument, let's fill it with
//                     # all positional arguments we have left and move on to
//                     # the next phase
//                     values = [arg_val]
//                     values.extend(arg_vals)
//                     arguments[param.name] = tuple(values)
//                     break

//                 if param.name in kwargs:
//                     raise PyTypeError('multiple values for argument '
//                                     '{arg!r}'.format(arg=param.name))

//                 arguments[param.name] = arg_val

//     # Now, we iterate through the remaining parameters to process
//     # keyword arguments
//     kwargs_param = None
//     for param in itertools.chain(parameters_ex, parameters):
//         if param.kind === _VAR_KEYWORD:
//             # Memorize that we have a '**kwargs'-like parameter
//             kwargs_param = param
//             continue

//         if param.kind === _VAR_POSITIONAL:
//             # Named arguments don't refer to '*args'-like parameters.
//             # We only arrive here if the positional arguments ended
//             # before reaching the last parameter before *args.
//             continue

//         param_name = param.name
//         try:
//             arg_val = kwargs.pop(param_name)
//         except PyKeyError:
//             # We have no value for this parameter.  It's fine though,
//             # if it has a default value, or it is an '*args'-like
//             # parameter, left alone by the processing of positional
//             # arguments.
//             if (not partial and param.kind !== _VAR_POSITIONAL and
//                                                 param.default is _empty):
//                 raise PyTypeError('{arg!r} parameter lacking default value'. \
//                                 format(arg=param_name)) from None

//         else:
//             if param.kind === _POSITIONAL_ONLY:
//                 # This should never happen in case of a properly built
//                 # Signature object (but let's have this check here
//                 # to ensure correct behaviour just in case)
//                 raise PyTypeError('{arg!r} parameter is positional only, '
//                                 'but was passed as a keyword'. \
//                                 format(arg=param.name))

//             arguments[param_name] = arg_val

//     if kwargs:
//         if kwargs_param is not None:
//             // Process our '**kwargs'-like parameter
//             arguments[kwargs_param.name] = kwargs
//         else:
//             raise PyTypeError('too many keyword arguments')

//     return self._bound_arguments_cls(self, arguments)

// def bind(*args, **kwargs):
//     '''Get a BoundArguments object, that maps the passed `args`
//     and `kwargs` to the function's signature.  Raises `PyTypeError`
//     if the passed arguments can not be bound.
//     '''
//     return args[0]._bind(args[1:], kwargs)

// def bind_partial(*args, **kwargs):
//     '''Get a BoundArguments object, that partially maps the
//     passed `args` and `kwargs` to the function's signature.
//     Raises `PyTypeError` if the passed arguments can not be bound.
//     '''
//     return args[0]._bind(args[1:], kwargs, partial=True)

// def __str__(self):
//     result = []
//     render_pos_only_separator = false
//     render_kw_only_separator = True
//     for param in self.parameters.values():
//         formatted = str(param)

//         kind = param.kind

//         if kind === _POSITIONAL_ONLY:
//             render_pos_only_separator = True
//         elif render_pos_only_separator:
//             # It's not a positional-only parameter, and the flag
//             # is set to 'True' (there were pos-only params before.)
//             result.push('/')
//             render_pos_only_separator = false

//         if kind === _VAR_POSITIONAL:
//             # OK, we have an '*args'-like parameter, so we won't need
//             # a '*' to separate keyword-only arguments
//             render_kw_only_separator = false
//         elif kind === _KEYWORD_ONLY and render_kw_only_separator:
//             # We have a keyword-only parameter to render and we haven't
//             # rendered an '*args'-like parameter before, so add a '*'
//             # separator to the parameters list ("foo(arg1, *, arg2)" case)
//             result.push('*')
//             # This condition should be only triggered once, so
//             # reset the flag
//             render_kw_only_separator = false

//         result.push(formatted)

//     if render_pos_only_separator:
//         # There were only positional-only parameters, hence the
//         # flag was not reset to 'false'
//         result.push('/')

//     rendered = '({})'.format(', '.join(result))

//     if self.return_annotation is not _empty:
//         anno = formatannotation(self.return_annotation)
//         rendered += ' -> {}'.format(anno)

//     return rendered
