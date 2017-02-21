var moment = require('moment-timezone')

var type_name = require('../core').type_name
var exceptions = require('../core').exceptions
var types = require('../types')

var time = {
    __doc__: '',
    __file__: 'batavia/modules/time.js',
    __name__: 'math',
    __package__: '',
    _startTime: new Date().getTime()
}

time.clock = function() {
    return new types.Float(new Date().getTime() - time._startTime)
}

time.time = function() {
    // JS operates in milliseconds, Python in seconds, so divide by 1000
    return new types.Float(new Date().getTime() / 1000)
}

time.sleep = function(secs) {
    if (secs < 0) {
        throw new exceptions.ValueError.$pyclass('sleep length must be non-negative')
    }

    var start = new Date().getTime()
    while (1) {
        if ((new Date().getTime() - start) / 1000 > secs) {
            break
        }
    }
}

time.struct_time = function(sequence) {
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

    if (types.isinstance(sequence, [types.Bytearray, types.Bytes, types.Dict,
        types.FrozenSet, types.List, types.Range, types.Set, types.Str,
        types.Tuple])) {
        if (sequence.length < 9) {
            throw new exceptions.TypeError.$pyclass('time.struct_time() takes an at least 9-sequence (' + sequence.length + '-sequence given)')
        } else if (sequence.length > 11) {
            throw new exceptions.TypeError.$pyclass('time.struct_time() takes an at most 11-sequence (' + sequence.length + '-sequence given)')
        }

        var items
        // might need to convert sequence to a more manageable type
        if (types.isinstance(sequence, [types.Bytearray])) {
            // dict won't work until .keys() is implemented
            // bytearray won't work until .__iter__ is implemented

            throw new exceptions.NotImplementedError.$pyclass('not implemented for ' + type_name(sequence) + '.')
        } else if (types.isinstance(sequence, [types.Bytes, types.FrozenSet,
            types.Set, types.Range])) {
            items = new types.Tuple(sequence)
        } else if (types.isinstance(sequence, types.Dict)) {
            items = sequence.keys()
        } else {
            // friendly type, no extra processing needed
            items = sequence
        }

        this.n_fields = 11
        this.n_unnamed_fields = 0
        this.n_sequence_fields = 9

        this.push.apply(this, items.slice(0, 9))  // only first 9 elements accepted for __getitem__

        var attrs = [
            'tm_year', 'tm_mon', 'tm_mday',
            'tm_hour', 'tm_min', 'tm_sec',
            'tm_wday', 'tm_yday', 'tm_isdst',
            'tm_zone', 'tm_gmtoff'
        ]

        for (var i = 0; i < items.length; i++) {
            this[attrs[i]] = items[i]
        }
    } else {
        // some other, unacceptable type
        throw new exceptions.TypeError.$pyclass('constructor requires a sequence')
    }
}

time.struct_time.prototype = new types.Tuple()

time.struct_time.prototype.__str__ = function() {
    return 'time.struct_time(tm_year=' + this.tm_year + ', tm_mon=' + this.tm_mon + ', tm_mday=' + this.tm_mday + ', tm_hour=' + this.tm_hour + ', tm_min=' + this.tm_min + ', tm_sec=' + this.tm_sec + ', tm_wday=' + this.tm_wday + ', tm_yday=' + this.tm_yday + ', tm_isdst=' + this.tm_isdst + ')'
}

time.struct_time.prototype.__repr__ = function() {
    return this.__str__()
}

time.mktime = function(sequence) {
    // sequence: struct_time like
    // documentation: https://docs.python.org/3/library/time.html#time.mktime

    // Validations
    if (arguments.length !== 1) {
        throw new exceptions.TypeError.$pyclass('mktime() takes exactly one argument (' + arguments.length + ' given)')
    }

    if (!types.isinstance(sequence, [types.Tuple, time.struct_time])) {
        throw new exceptions.TypeError.$pyclass('Tuple or struct_time argument required')
    }

    if (sequence.length !== 9) {
        throw new exceptions.TypeError.$pyclass('function takes exactly 9 arguments (' + sequence.length + ' given)')
    }

    if (sequence[0] < 1900) {
        // because the earliest possible date is system dependant, use an arbitrary cut off for now.
        throw new exceptions.OverflowError.$pyclass('mktime argument out of range')
    }

    // all items must be integers
    for (var i = 0; i < sequence.length; i++) {
        var item = sequence[i]
        if (types.isinstance(item, types.Float)) {
            throw new exceptions.TypeError.$pyclass('integer argument expected, got float')
        } else if (!types.isinstance(item, types.Int)) {
            throw new exceptions.TypeError.$pyclass('an integer is required (got type ' + type_name(item) + ')')
        }
    }

    // Find the local timezone, and create a datetime in that timezone.
    var tz_name = moment.tz.guess()
    var m = moment.tz(
        [
            sequence[0].int32(),
            sequence[1].int32() - 1,
            sequence[2].int32(),
            sequence[3].int32(),
            sequence[4].int32(),
            sequence[5].int32(),
            0
        ],
        tz_name
    )
    var d = m.toDate()

    if (isNaN(d)) {
        // d is too large per ECMA specs
        // source: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
        throw new exceptions.OverflowError.$pyclass('signed integer is greater than maximum')
    }

    var seconds = d.getTime() / 1000

    // If the struct_time requests DST (sequence[8] === 1), but
    // the local timezone *wouldn't* be in DST, or the struct_time
    // doesn't request DST (sequence[8] === 0) but the local timezone
    // *would* be in DST, the seconds value will be out by 3600 seconds.
    // This is because Javascript (and browsers) know about timezones,
    // but Python datetimes are naive without PyTZ.
    // So, adjust the answer accordingly.
    if (m.isDST() && sequence[8] === 0 && tz_name !== 'UTC') {
        seconds = seconds + 3600
    } else if (!m.isDST() && sequence[8] === 1 && tz_name !== 'UTC') {
        seconds = seconds - 3600
    }

    return seconds.toFixed(1)
}

time.gmtime = function(seconds) {
    // https://docs.python.org/3/library/time.html#time.gmtime

    // 0-1 arguments allowed
    if (arguments.length > 1) {
        throw new exceptions.TypeError.$pyclass('gmtime() takes at most 1 argument (' + arguments.length + ' given)')
    }

    if (arguments.length === 1) {
        // catching bad types
        if (types.isinstance(seconds, [types.Complex])) {
            throw new exceptions.TypeError.$pyclass("can't convert " + type_name(seconds) + ' to int')
        } else if (!(types.isinstance(seconds, [types.Int, types.Float, types.Bool]))) {
            throw new exceptions.TypeError.$pyclass('an integer is required (got type ' + type_name(seconds) + ')')
        }

        var date = new Date(seconds * 1000)
        if (isNaN(date)) {
            // date is too large per ECMA specs
            // source: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
            throw new exceptions.OSError.$pyclass('Value too large to be stored in data type')
        }
    } else if (seconds === undefined) {
        var date = new Date()
    }

    var sequence = [
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCDay() - 1
    ]

    // add day of year
    var firstOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
    var diff = date - firstOfYear
    var oneDay = 1000 * 60 * 60 * 24
    var dayOfYear = Math.floor(diff / oneDay)
    sequence.push(dayOfYear + 1)

    sequence.push(0)  // dst for UTC, always off

    return new time.struct_time(new types.Tuple(sequence))
}

time.localtime = function(seconds) {
    // https://docs.python.org/3.0/library/time.html#time.localtime

    // 0-1 arguments allowed
    if (arguments.length > 1) {
        throw new exceptions.TypeError.$pyclass('localtime() takes at most 1 argument (' + arguments.length + ' given)')
    }

    if (arguments.length === 1) {
        // catching bad types
        if (types.isinstance(seconds, [types.Complex])) {
            throw new exceptions.TypeError.$pyclass("can't convert " + type_name(seconds) + ' to int')
        } else if (!(types.isinstance(seconds, [types.Int, types.Float, types.Bool]))) {
            throw new exceptions.TypeError.$pyclass('an integer is required (got type ' + type_name(seconds) + ')')
        }

        var date = new Date(seconds * 1000)
        if (isNaN(date)) {
            // date is too large per ECMA specs
            // source: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
            throw new exceptions.OSError.$pyclass('Value too large to be stored in data type')
        }
    } else if (seconds === undefined) {
        var date = new Date()
    }

    var sequence = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getDay() - 1
    ]

    // add day of year
    var firstOfYear = new Date(date.getFullYear(), 0, 1)
    var diff = date - firstOfYear
    var oneDay = 1000 * 60 * 60 * 24
    var dayOfYear = Math.floor(diff / oneDay)
    sequence.push(dayOfYear + 1)

    // is DST in effect?
    var tz = moment.tz.guess()
    var isDST = moment(date.getTime()).tz(tz).isDST()
    sequence.push(Number(isDST))

    return new time.struct_time(new types.Tuple(sequence))
}

module.exports = time
