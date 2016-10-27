
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
        copied from https://docs.python.org/3/library/time.html#time.struct_time

        Index 	Attribute 	Values
        0 	    tm_year 	(for example, 1993)
        1 	    tm_mon 	    range [1, 12]
        2 	    tm_mday 	range [1, 31]
        3 	    tm_hour 	range [0, 23]
        4 	    tm_min 	    range [0, 59]
        5 	    tm_sec 	    range [0, 61]; see (2) in strftime() description
        6 	    tm_wday 	range [0, 6], Monday is 0
        7 	    tm_yday 	range [1, 366]
        8 	    tm_isdst 	0, 1 or -1; see below
        N/A 	tm_zone 	abbreviation of timezone name
        N/A 	tm_gmtoff 	offset east of UTC in seconds
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

        // might need to convert sequence to a more manageable type
        if (batavia.isinstance(sequence, [batavia.types.Bytearray])){
            // dict won't work until .keys() is implemented
            // bytearray won't work until .__iter__ is implemented

            throw new batavia.builtins.NotImplementedError("not implemented for "+ batavia.type_name(sequence)+".")

        } else if (batavia.isinstance(sequence, [batavia.types.Bytes, batavia.types.FrozenSet,
            batavia.types.Set, batavia.types.Range])) {

            var items = new batavia.types.Tuple(sequence);

        } else if (batavia.isinstance(sequence, batavia.types.Dict)){

            var items = sequence.keys();

        } else {
            // friendly type, no extra processing needed
            var items = sequence;
        }

        this.n_fields = 11;
        this.n_unnamed_fields = 0;
        this.n_sequence_fields = 9;

       this.push.apply(this, items.slice(0,9));  // only first 9 elements accepted for __getitem__

        var attrs = [ 'tm_year', 'tm_mon', 'tm_mday', 'tm_hour', 'tm_min', 'tm_sec', 'tm_wday', 'tm_yday', 'tm_isdst',
            'tm_zone', 'tm_gmtoff']

        for (var i=0; i<items.length; i++){
            this[attrs[i]] = items[i];
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

batavia.modules.time.mktime = function(sequence){
    // sequence: struct_time like
    // documentation: https://docs.python.org/3/library/time.html#time.mktime

    //Validations
    if (arguments.length != 1){
        throw new batavia.builtins.TypeError("mktime() takes exactly one argument ("+arguments.length+" given)");
    }

    if (!batavia.isinstance(sequence, [batavia.types.Tuple, batavia.modules.time.struct_time])) {
        throw new batavia.builtins.TypeError("Tuple or struct_time argument required");
    }

    if (sequence.length !== 9){
        throw new batavia.builtins.TypeError("function takes exactly 9 arguments ("+sequence.length+" given)");
    }

    if (sequence[0] < 1900){
        // because the earliest possible date is system dependant, use an arbitrary cut off for now.
        throw new batavia.builtins.OverflowError("mktime argument out of range");
    }

    // all items must be integers
    for (var i=0; i<sequence.length; i++){
        var item = sequence[i];
        if (batavia.isinstance(item, batavia.types.Float)){
            throw new batavia.builtins.TypeError("integer argument expected, got float")
        }
        else if (!batavia.isinstance(item, [batavia.types.Int])){
            throw new batavia.builtins.TypeError("an integer is required (got type " + batavia.type_name(item) + ")");
        }
    }

    var date = new Date(sequence[0], sequence[1] - 1, sequence[2], sequence[3], sequence[4], sequence[5], 0)

    if (isNaN(date)){
        // date is too large per ECMA specs
        // source: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
        throw new batavia.builtins.OverflowError("signed integer is greater than maximum")
    }

    var seconds = date.getTime() / 1000;
    return seconds.toFixed(1);
}

batavia.modules.time.gmtime = function(seconds){
    // https://docs.python.org/3/library/time.html#time.gmtime

    // 0-1 arguments allowed
    if (arguments.length > 1){
        throw new batavia.builtins.TypeError("gmtime() takes at most 1 argument (" + arguments.length + " given)")
    }

    if (arguments.length == 1) {
        // catching bad types
        if (batavia.isinstance(seconds, [batavia.types.Complex])){
            throw new batavia.builtins.TypeError("can't convert " + batavia.type_name(seconds) + " to int")

        } else if (!(batavia.isinstance(seconds, [batavia.types.Int, batavia.types.Float, batavia.types.Bool]))) {
            throw new batavia.builtins.TypeError("an integer is required (got type " + batavia.type_name(seconds) + ")")
        }

        var date = new Date(seconds * 1000)
        if (isNaN(date)){
            // date is too large per ECMA specs
            // source: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
            throw new batavia.builtins.OSError("Value too large to be stored in data type")
        }

    } else if (seconds === undefined){
        var date = new Date();
    }

    var sequence = [date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCDay() -1
    ]

    // add day of year
    var firstOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    var diff = date - firstOfYear;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    sequence.push(dayOfYear + 1);

    sequence.push(0)  // dst for UTC, always off

    return new batavia.modules.time.struct_time(new batavia.types.Tuple(sequence))
}

batavia.modules.time.localtime = function(seconds){
    // https://docs.python.org/3.0/library/time.html#time.localtime

    // 0-1 arguments allowed
    if (arguments.length > 1){
        throw new batavia.builtins.TypeError("localtime() takes at most 1 argument (" + arguments.length + " given)")
    }

    if (arguments.length == 1) {
        // catching bad types
        if (batavia.isinstance(seconds, [batavia.types.Complex])){
            throw new batavia.builtins.TypeError("can't convert " + batavia.type_name(seconds) + " to int")

        } else if (!(batavia.isinstance(seconds, [batavia.types.Int, batavia.types.Float, batavia.types.Bool]))) {
            throw new batavia.builtins.TypeError("an integer is required (got type " + batavia.type_name(seconds) + ")")
        }

        var date = new Date(seconds * 1000)
        if (isNaN(date)){
            // date is too large per ECMA specs
            // source: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
            throw new batavia.builtins.OSError("Value too large to be stored in data type")
        }

    } else if (seconds === undefined){
        var date = new Date();
    }

    var sequence = [date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getDay() -1
    ]

    // add day of year
    var firstOfYear = new Date(date.getFullYear(), 0, 1);
    var diff = date - firstOfYear;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    sequence.push(dayOfYear + 1);

    // is DST in effect
    var tz = batavia.vendored.moment.tz.guess()
    var isDST = batavia.vendored.moment(date.getTime()).tz(tz).isDST()
    sequence.push(Number(isDST))

    return new batavia.modules.time.struct_time(new batavia.types.Tuple(sequence))

}
