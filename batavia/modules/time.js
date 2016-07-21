
batavia.modules.time = {
    clock: function() {
        return new Date().getTime();
    },

    time: function() {
        // JS operates in milliseconds, Python in seconds, so divide by 1000
        return new Date().getTime() / 1000;
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
