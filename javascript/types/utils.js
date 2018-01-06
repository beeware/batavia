import { PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

export function inplace_call(f, operand_str, this_obj, other) {
    // Call the method named "f" with argument "other"; if a type error is raised, throw a different type error
    try {
        return this_obj[f](other)
    } catch (error) {
        if (error instanceof PyTypeError) {
            throw new PyTypeError(
                'unsupported operand type(s) for ' +
                operand_str + ": '" + type_name(this_obj) +
                "' and '" + type_name(other) + "'"
            )
        } else {
            throw error
        }
    }
}
