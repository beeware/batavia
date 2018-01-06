import { create_pyclass, PyObject } from '../core/types'

/*************************************************************************
 * A Python dictview type
 *************************************************************************/

export default class DictView extends PyObject {
    constructor(args, kwargs) {
        super()
    }
}
create_pyclass(DictView, 'dictview')
