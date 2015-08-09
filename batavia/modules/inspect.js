
batavia.FullArgSpec = function(args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults, annotations) {
    this.args = args;
    this.varargs = varargs;
    this.keywords = keywords;
    this.defaults = defaults;
    this.kwonlyargs = kwonlyargs;
    this.kwonlydefaults = kwonlydefaults;
    this.annotations = annotations;
};

batavia.modules.inspect = {

    _signature_get_user_defined_method: function(cls, method_name) {
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
    },

    _signature_bound_method: function(sig) {
        // Internal helper to transform signatures for unbound
        // functions to bound methods

        var params = sig.parameters.values();

        if (!params || params[0].kind in (_VAR_KEYWORD, _KEYWORD_ONLY)) {
            throw ValueError('invalid method signature');
        }

        var kind = params[0].kind;
        if (kind in (_POSITIONAL_OR_KEYWORD, _POSITIONAL_ONLY)) {
            // Drop first parameter:
            // '(p1, p2[, ...])' -> '(p2[, ...])'
            params = params.slice(1);
        } else {
            if (kind !== _VAR_POSITIONAL) {
                // Unless we add a new parameter type we never
                // get here
                throw ValueError('invalid argument type');
            }
            // It's a var-positional parameter.
            // Do nothing. '(*args[, ...])' -> '(*args[, ...])'
        }

        return sig.replace(parameters=params);
    },

    _signature_internal: function(obj, follow_wrapper_chains, skip_bound_arg) {
        // if (!callable(obj)) {
        //     throw TypeError('{!r} is not a callable object'.format(obj));
        // }

        // if (isinstance(obj, types.MethodType)) {
            // In this case we skip the first parameter of the underlying
            // function (usually `self` or `cls`).
            // sig = batavia.modules.inspect._signature_internal(obj.__func__, follow_wrapper_chains, skip_bound_arg);
            // if (skip_bound_arg) {
            //     return batavia.modules.inspect._signature_bound_method(sig);
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
        //             throw TypeError(
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

        //         wrapped_sig = batavia.modules.inspect._signature_internal(partialmethod.func,
        //                                           follow_wrapper_chains,
        //                                           skip_bound_arg)
        //         sig = batavia.modules.inspect._signature_get_partial(wrapped_sig, partialmethod, (None,))

        //         first_wrapped_param = tuple(wrapped_sig.parameters.values())[0]
        //         new_params = (first_wrapped_param,) + tuple(sig.parameters.values())

        //         return sig.replace(parameters=new_params)

        // if isfunction(obj) or _signature_is_functionlike(obj):
        //     # If it's a pure Python function, or an object that is duck type
        //     # of a Python function (Cython functions, for instance), then:
            return Signature.from_function(obj);

        // if _signature_is_builtin(obj):
        //     return batavia.modules.inspect._signature_from_builtin(Signature, obj,
        //                                    skip_bound_arg=skip_bound_arg)

        // if isinstance(obj, functools.partial):
        //     wrapped_sig = batavia.modules.inspect._signature_internal(obj.func,
        //                                       follow_wrapper_chains,
        //                                       skip_bound_arg)
        //     return batavia.modules.inspect._signature_get_partial(wrapped_sig, obj)

        // sig = None
        // if isinstance(obj, type):
        //     // obj is a class or a metaclass

        //     // First, let's see if it has an overloaded __call__ defined
        //     // in its metaclass
        //     call = batavia.modules.inspect._signature_get_user_defined_method(type(obj), '__call__')
        //     if call is not None:
        //         sig = batavia.modules.inspect._signature_internal(call,
        //                                   follow_wrapper_chains,
        //                                   skip_bound_arg)
        //     else:
        //         # Now we check if the 'obj' class has a '__new__' method
        //         new = _signature_get_user_defined_method(obj, '__new__')
        //         if new is not None:
        //             sig = batavia.modules.inspect._signature_internal(new,
        //                                       follow_wrapper_chains,
        //                                       skip_bound_arg)
        //         else:
        //             # Finally, we should have at least __init__ implemented
        //             init = _signature_get_user_defined_method(obj, '__init__')
        //             if init is not None:
        //                 sig = batavia.modules.inspect._signature_internal(init,
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
        //             except AttributeError:
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
        //         except ValueError as ex:
        //             msg = 'no signature found for {!r}'.format(obj)
        //             raise ValueError(msg) from ex

        // if sig is not None:
        //     # For classes and objects we skip the first parameter of their
        //     # __call__, __new__, or __init__ methods
        //     if skip_bound_arg:
        //         return _signature_bound_method(sig)
        //     else:
        //         return sig

        // if isinstance(obj, types.BuiltinFunctionType):
        //     # Raise a nicer error message for builtins
        //     msg = 'no signature found for builtin function {!r}'.format(obj)
        //     raise ValueError(msg)

        // raise ValueError('callable {!r} is not supported by signature'.format(obj))
    },

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
    getfullargspec: function(func) {
        // try {
            // Re: `skip_bound_arg=False`
            //
            // There is a notable difference in behaviour between getfullargspec
            // and Signature: the former always returns 'self' parameter for bound
            // methods, whereas the Signature always shows the actual calling
            // signature of the passed object.
            //
            // To simulate this behaviour, we "unbind" bound methods, to trick
            // batavia.modules.inspect.signature to always return their first parameter ("self",
            // usually)

            // Re: `follow_wrapper_chains=False`
            //
            // getfullargspec() historically ignored __wrapped__ attributes,
            // so we ensure that remains the case in 3.3+

            var sig = batavia.modules.inspect._signature_internal(func, false, false);

            var args = [];
            var varargs = null;
            var varkw = null;
            var kwonlyargs = [];
            var defaults = [];
            var annotations = {};
            var kwdefaults = {};

            if (sig.return_annotation !== sig.empty) {
                annotations['return'] = sig.return_annotation;
            }

            for (var param in sig.parameters) {
                if (sig.parameters.hasOwnProperty(param)) {
                    var kind = sig.parameters[param].kind;
                    var name = sig.parameters[param].name;

                    if (kind === dis._POSITIONAL_ONLY) {
                        args.append(name);
                    } else if (kind === dis._POSITIONAL_OR_KEYWORD) {
                        args.append(name);
                        if (param.default !== param.empty) {
                            defaults.push(param.default);
                        }
                    } else if (kind === dis._VAR_POSITIONAL) {
                        varargs = name;
                    } else if (kind === dis._KEYWORD_ONLY) {
                        kwonlyargs.append(name);
                        if (param.default !== param.empty) {
                            kwdefaults[name] = param.default;
                        }
                    } else if (kind === dis._VAR_KEYWORD) {
                        varkw = name;
                    }

                    if (param.annotation !== param.empty) {
                        annotations[name] = param.annotation;
                    }
                }
            }

            if (kwdefaults.length === 0) {
                // compatibility with 'func.__kwdefaults__'
                kwdefaults = null;
            }

            if (defaults.length === 0) {
                // compatibility with 'func.__defaults__'
                defaults = null;
            }

            return new FullArgSpec(args, varargs, varkw, defaults, kwonlyargs, kwdefaults, annotations);
        // } catch (ex) {
            // Most of the times 'signature' will raise ValueError.
            // But, it can also raise AttributeError, and, maybe something
            // else. So to be fully backwards compatible, we catch all
            // possible exceptions here, and reraise a TypeError.
            // raise TypeError('unsupported callable') from ex
            // throw TypeError('unsupported callable');
        // }
    },

    _missing_arguments: function(f_name, argnames, pos, values) {
        throw "FIXME: Missing arguments";
        // names = [repr(name) for name in argnames if name not in values]
        // missing = len(names)
        // if missing == 1:
        //     s = names[0]
        // elif missing == 2:
        //     s = "{} and {}".format(*names)
        // else:
        //     tail = ", {} and {}".format(*names[-2:])
        //     del names[-2:]
        //     s = ", ".join(names) + tail
        // raise TypeError("%s() missing %i required %s argument%s: %s" %
        //                 (f_name, missing,
        //                   "positional" if pos else "keyword-only",
        //                   "" if missing == 1 else "s", s))
    },

    _too_many: function(f_name, args, kwonly, varargs, defcount, given, values) {
        throw "FIXME: Too many arguments";
        // atleast = len(args) - defcount
        // kwonly_given = len([arg for arg in kwonly if arg in values])
        // if varargs:
        //     plural = atleast != 1
        //     sig = "at least %d" % (atleast,)
        // elif defcount:
        //     plural = True
        //     sig = "from %d to %d" % (atleast, len(args))
        // else:
        //     plural = len(args) != 1
        //     sig = str(len(args))
        // kwonly_sig = ""
        // if kwonly_given:
        //     msg = " positional argument%s (and %d keyword-only argument%s)"
        //     kwonly_sig = (msg % ("s" if given != 1 else "", kwonly_given,
        //                          "s" if kwonly_given != 1 else ""))
        // raise TypeError("%s() takes %s positional argument%s but %d%s %s given" %
        //         (f_name, sig, "s" if plural else "", given, kwonly_sig,
        //          "was" if given == 1 and not kwonly_given else "were"))
    },

    /*
     * Get the mapping of arguments to values.
     *
     * A dict is returned, with keys the function argument names (including the
     * names of the * and ** arguments, if any), and values the respective bound
     * values from 'positional' and 'named'.
     */
    getcallargs: function(func_and_positional, named) {
        var func = func_and_positional[0];
        var positional = func_and_positional.slice(1);
        var spec = func.argspec;

        // args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults, ann = spec
        var arg2value = {};

        // if ismethod(func) and func.__self__ is not None:
        //     # implicit 'self' (or 'cls' for classmethods) argument
        //     positional = (func.__self__,) + positional
        var num_pos = positional.length;
        var num_args = func.argspec.args.length;
        num_defaults = func.argspec.defaults ? func.argspec.defaults.length : 0;

        n = Math.min(num_pos, num_args);
        for (var i = 0; i < n; i++) {
            arg2value[args[i]] = positional[i];
        }

        if (func.argspec.varargs.length > 0) {
            arg2value[varargs] = positional.slice(n);
        }
        var possible_kwargs = set(args + kwonlyargs);

        if (func.argspec.varkw.length > 0) {
            arg2value[varkw] = {};
        }

        for (var kw in named) {
            if (named.hasOwnProperty(kw)) {
                if (!(kw in possible_kwargs)) {
                    if (!varkw) {
                        throw TypeError("%s() got an unexpected keyword argument %r" %
                                    (func.__name__, kw));
                    }
                    arg2value[varkw][kw] = value;
                    continue;
                }
                if (kw in arg2value) {
                    throw TypeError("%s() got multiple values for argument %r" %
                                    (func.__name__, kw));
                }
                arg2value[kw] = value;
            }
        }

        if (num_pos > num_args && varargs.length === 0) {
            batavia.modules.inspect._too_many(func.__name__, args, kwonlyargs, varargs, num_defaults, num_pos, arg2value);
        }
        if (num_pos < num_args) {
            req = args.slice(0, num_args - num_defaults);
            for (var arg in req) {
                if (!(req[arg] in arg2value)) {
                    batavia.modules.inspect._missing_arguments(func.__name__, req, True, arg2value);
                }
            }
            // for (var i in enumerate(args[num_args - num_defaults:]) {}
            //     if arg not in arg2value:
            //         arg2value[arg] = defaults[i]
            // }
        }
        // missing = 0
        // for kwarg in kwonlyargs:
        //     if kwarg not in arg2value:
        //         if kwonlydefaults and kwarg in kwonlydefaults:
        //             arg2value[kwarg] = kwonlydefaults[kwarg]
        //         else:
        //             missing += 1
        // if missing:
        //     batavia.modules.inspect._missing_arguments(func.__name__, kwonlyargs, False, arg2value)
        return arg2value;
    }
};
