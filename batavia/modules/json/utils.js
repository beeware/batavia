var exceptions = require('../../core').exceptions

var requiredArg = function(arg) {
    throw new TypeError('validateParams missing required argument ' + arg)
}

var validateParams = function({
    args = requiredArg('args'),
    kwargs = requiredArg('kwargs'),
    names = [],
    defaults = {},
    numRequired = 0,
    funcName = requiredArg('funcName')
} = {}) {
    if (args.length > names.length) {
        throw new exceptions.TypeError.$pyclass(
            funcName + '() takes ' + numRequired + ' - ' + names.length +
            ' positional arguments but ' + args.length + ' were given'
        )
    }

    var required = names.slice(0, numRequired)
    var ret = Object.assign({}, defaults)

    for (let arg of args) {
        ret[names.shift()] = arg
    }

    for (var key in kwargs.valueOf()) {
        if (kwargs.hasOwnProperty(key)) {
            if (!ret.hasOwnProperty(key) && required.indexOf(key) < 0) {
                throw new exceptions.TypeError.$pyclass(
                    funcName + "() got an unexpected keyword argument '" +
                    key + "'"
                )
            }
            if (names.indexOf(key) < 0) {
                throw new exceptions.TypeError.$pyclass(
                    funcName + "() got multiple values for argument '" +
                    key + "'"
                )
            }
        }
    }

    ret = Object.assign(ret, kwargs)

    for (let req of required) {
        if (!ret.hasOwnProperty(req)) {
            throw new exceptions.TypeError.$pyclass(
                funcName + "() missing required positional argument '" +
                req + "'"
            )
        }
    }

    return ret
}

module.exports = {
    'validateParams': validateParams
}
