batavia.modules.random = {
    __doc__: "",
    __name__: "random",
    __file__:"random.js",
    __package__: "",

    BPF: new batavia.types.Int(53),
    LOG4: new batavia.types.Float(Math.log(4)),
    NV_MAGICCONST: new batavia.types.Float(1.7155277699214135),
    RECIP_BPF: new batavia.types.Float(Math.pow(2, -53)),
    SG_MAGICCONST: new batavia.types.Float(1 + Math.log(4.5)),
    TWOPI: new batavia.types.Float(Math.PI * 2),
    _e: new batavia.types.Float(Math.E),
    _pi: new batavia.types.Float(Math.PI),

    _acos: function(number) {
        return new batavia.types.Float(Math.acos(number));
    },

    _ceil: function(number) {
        return new batavia.types.Int(Math.ceil(number));
    },

    _cos: function(number) {
        return new batavia.types.Float(Math.cos(number));
    },

    _exp: function(number) {
        return new batavia.types.Float(Math.exp(number));
    },

    _log: function(number, base) {
      base = base || '_'
        if (base <= 0 || number <= 0) {
            throw new batavia.builtins.ValueError("math domain error")
        }
        if (base == '_'){
            return new batavia.types.Float(Math.log(number));
        };
        return new batavia.types.Float(Math.log(number) / Math.log(base));
    },

    _sin: function(number) {
        return new batavia.types.Float(Math.sin(number));
    },

    _sqrt: function(number) {
        if (number < 0) {
            throw new batavia.builtins.ValueError("math domain error");
          }
        return new batavia.types.Float(Math.sqrt(number));
    },

    choice: function(list) {
        var list = new batavia.types.List(list);
        var rand_index = Math.floor(Math.random() * list.length);
        return list[rand_index];
    },

    randint: function(lower, upper) {
        return Math.round((Math.random() * (upper - lower)) + lower);
    },

    random: function() {
        return Math.random();
    },

};
