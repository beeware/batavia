import { create_pyclass, PyObject } from '../core/types'

/*************************************************************************
 * A Python ellipsis type
 *************************************************************************/

export default class Ellipsis extends PyObject {
    constructor(args, kwargs) {
        super()
    }
}
create_pyclass(Ellipsis, 'ellipsis')
