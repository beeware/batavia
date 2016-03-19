/*
 * Javascript DOM module.
 *
 * This is a wrapper to allow Python code to access DOM objects and methods.
 */

/* Proxy function calls to DOM objects.
 * This has two purposes -
 *  1. To unwind posargs into arguments on the DOM function
 *  2. To set `this` on the function call.
 */
var __func_proxy__ = function(obj, attr) {
    return function(posargs, kwargs) {
        return obj[attr].apply(obj, posargs);
    };
};

/*
 * Proxy attribute access on DOM objects.
 */
var __attr_proxy__ = function(obj, attr, proxy) {
    Object.defineProperty(
        proxy,
        attr,
        {
            get: function() {
                return obj[attr];
            },
            set: function(value) {
                obj[attr] = value;
            }
        }
    );

};

var __proxy__ = function(objname, obj) {
    var proxy = {};
    for (var attr in obj) {
        if (typeof obj[attr] === 'function') {
            proxy[attr] = __func_proxy__(obj, attr);
        } else {
            __attr_proxy__(obj, attr, proxy);
        }
    }
    return proxy;
};


batavia.modules.dom = {
};

batavia.modules.dom.self = __proxy__('self', self);
batavia.modules.dom.window = __proxy__('window', window);
batavia.modules.dom.parent = __proxy__('parent', parent);
batavia.modules.dom.top = __proxy__('top', top);

batavia.modules.dom.navigator = __proxy__('navigator', navigator);

batavia.modules.dom.frames = __proxy__('frames', frames);

batavia.modules.dom.location = __proxy__('location', location);

batavia.modules.dom.history = __proxy__('history', history);

batavia.modules.dom.document = __proxy__('document', document);

batavia.modules.dom.batavia = __proxy__('batavia', batavia);

// Register the DOM module as a builtin.
batavia.builtins.dom = batavia.modules.dom;
