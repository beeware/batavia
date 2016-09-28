
batavia.modules.time = {
    _startTime: new Date().getTime(),
    clock: function() {
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

batavia.modules.time.struct_time = function (sequence) {
    /*
        copied from https://docs.python.org/2/library/time.html#time.struct_time
        WHAT ATTRIBUTION DOES THIS NEED?

        0 	tm_year 	(for example, 1993)
        1 	tm_mon 	    range [1, 12]
        2 	tm_mday 	range [1, 31]
        3 	tm_hour 	range [0, 23]
        4 	tm_min 	    range [0, 59]
        5 	tm_sec 	    range [0, 61]; see (2) in strftime() description
        6 	tm_wday 	range [0, 6], Monday is 0
        7 	tm_yday 	range [1, 366]
        8 	tm_isdst 	0, 1 or -1; see below
    */

    if (batavia.isinstance(sequence, [batavia.types.Bytearray, batavia.types.Bytes, batavia.types.Dict,
        batavia.types.FrozenSet, batavia.types.List, batavia.types.Range, batavia.types.Set, batavia.types.Str,
        batavia.types.Tuple]
        )){

        if (sequence.length < 9){
            throw new batavia.builtins.TypeError("time.struct_time() takes an at least 9-sequence ("+sequence.length+"-sequence given)")
        } else if (sequence.length > 11) {
            throw new batavia.builtins.TypeError("time.struct_time() takes an at most 11-sequence ("+sequence.length+"-sequence given)")
        }

        this.n_fields = 11;
        this.n_unnamed_fields = 0;
        this.n_sequence_fields = 9;

        //TODO
        //tm_gmtoff


        this.push.apply(this, sequence.slice(0,9));  // only first 9 elements accepted for __getitem__

        var attrs = [ 'tm_year', 'tm_mon', 'tm_mday', 'tm_hour', 'tm_min', 'tm_sec', 'tm_wday', 'tm_yday', 'tm_isdst',
            'tm_zone', 'tm_gmtoff']

        for (var i=0; i<attrs.length; i++){
            this[attrs[i]] = sequence[i];
        }

    } else {
        //some other, unacceptable type
        throw new batavia.builtins.TypeError("constructor requires a sequence");
    }
}

batavia.modules.time.struct_time.prototype = new batavia.types.Tuple();

batavia.modules.time.struct_time.prototype.__str__ = function(){
    return "time.struct_time(tm_year="+this.tm_year+", tm_mon="+this.tm_mon+", tm_mday="+this.tm_mday+", tm_hour="+this.tm_hour+", tm_min="+this.tm_min+", tm_sec="+this.tm_sec+", tm_wday="+this.tm_wday+", tm_yday="+this.tm_yday+", tm_isdst="+this.tm_isdst+")"
}

batavia.modules.time.struct_time.prototype.__repr__ = function(){
    return this.__str__()
}

//TODO __reduce__