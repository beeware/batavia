module.exports = {
    __doc__: "",

    CallableProxyType: null, // not used directly in stdlib

    ProxyType: null, // not used directly in stdlib

    ReferenceType: null, // not used directly in stdlib

    getweakrefs: function(object) {
        return [];
    },
    getweakrefcount: function(object) {
        return 0;
    },
    proxy: function(object, callback) {
        // TODO: support the finalize callback
        return object;
    },
    ref: function(object) {
      return object;
    }
}
