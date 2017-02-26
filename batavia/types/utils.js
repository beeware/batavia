var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var utils = {}

utils.inplace_call = function(f, operand_str, this_obj, other) {
    // Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
    try {
        return this_obj[f](other)
    } catch (error) {
        if (error instanceof exceptions.TypeError.$pyclass) {
            throw new exceptions.TypeError.$pyclass(
                'unsupported operand type(s) for ' + operand_str + ': ' + "'" + type_name(this_obj) + "'" + ' and ' + "'" + type_name(other) + "'")
        } else {
            throw error
        }
    }
}

module.exports = utils
