var utils = {}

utils.inplace_call = function(f, operand_str, this, other) {
    // Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
    try {
        return this[f](other)
    } catch (error) {
        if (error instanceof exceptions.TypeError.$pyclass) {
            throw new exceptions.TypeError.$pyclass(
                'unsupported operand type(s) for ' + operand_str + ": 'int' and '" + type_name(other) + "'")
        } else {
            throw error
        }
    }
}



module.export = utils
