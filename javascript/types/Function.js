/* eslint-disable no-extend-native */
import { pyargs } from '../core/callables'
import JSDict from '../core/JSDict'
import { jstype, PyObject } from '../core/types'

import { inspect } from '../modules/inspect'
import { dis } from '../modules/dis'

import * as types from '../types'

/*************************************************************************
 * A Python function type.
 *************************************************************************/

class PyFunction extends PyObject {
    __init__(name, code, globals, defaults, closure, vm) {
        this.$vm = vm
        this.__self__ = null
        this.__code__ = code
        this.__globals__ = globals
        this.__defaults__ = defaults
        this.__kwdefaults__ = null
        this.__closure__ = closure
        if (code.co_consts.length > 0) {
            this.__doc__ = code.co_consts[0]
        } else {
            this.__doc__ = null
        }
        this.__name__ = name || code.co_name
        this.__dict__ = types.pydict()
        this.__annotations__ = types.pydict()
        this.__qualname__ = this.__name__

        // let kw = {
        //     'argdefs': this.__defaults__,
        // }
        // if (closure) {
        //     kw['closure'] = tuple(make_cell(0) for _ in closure)
        // }

        this.$argspec = inspect.getfullargspec(this)
    }

    apply(self, args) {
        let callargs = inspect.getcallargs(this, args)
        let frame = this.$vm.make_frame({
            'code': this.__code__,
            'callargs': callargs,
            'f_globals': this.__globals__,
            'f_locals': new JSDict()
        })

        let retval
        if (this.__code__.co_flags & dis.CO_GENERATOR) {
            frame.generator = types.pygenerator(frame, self)
            retval = frame.generator
        } else {
            retval = this.$vm.run_frame(frame)
        }
        return retval
    }

    @pyargs(null)
    __call__(args, kwargs, locals) {
        let retval
        let callargs = inspect.getcallargs(this, args, kwargs)

        if (locals === undefined) {
            locals = new JSDict()
        }

        let frame = this.$vm.make_frame({
            'code': this.__code__,
            'callargs': callargs,
            'f_globals': this.__globals__,
            'f_locals': locals
        })

        if (this.__code__.co_flags & dis.CO_GENERATOR) {
            frame.generator = types.pygenerator(frame, this)
            retval = frame.generator
        } else {
            retval = this.$vm.run_frame(frame)
        }
        return retval
    }

    __get__(obj) {
        // Module functions don't need to be bound to the instance as methods.
        let bound
        if (types.isinstance(obj, types.pymodule)) {
            bound = this
        } else {
            bound = types.pymethod(obj, this)
        }
        return bound
    }
}

const pyfunction = jstype(PyFunction, 'function', [], {})
export default pyfunction
