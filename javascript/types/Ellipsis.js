import { jstype, PyObject } from '../core/types'

/*************************************************************************
 * A Python ellipsis type
 *************************************************************************/

class Ellipsis extends PyObject {
}

const pyellipsis = jstype(Ellipsis, 'ellipsis', [], null)
export default pyellipsis
