
batavia.modules.time = {
    _startTime: new Date().getTime(),
    clock: function() {
        // TODO: this does something a little different in CPython.
        return new batavia.types.Float(new Date().getTime() - batavia.modules.time._startTime);
    },

    time: function() {
        // JS operates in milliseconds, Python in seconds, so divide by 1000
        return new batavia.types.Float(new Date().getTime() / 1000);
    },

    sleep: function(secs) {
        if (secs < 0) {
            throw new batavia.builtins.ValueError('sleep length must be non-negative')
        }

        var start = new Date().getTime();
        while (1) {
            if ((new Date().getTime() - start) / 1000 > secs){
                break;
            }
        }
    }
};
