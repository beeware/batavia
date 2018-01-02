import { sys } from '../modules/sys'

import credits from './credits'
import copyright from './copyright'

export default function license() {
    sys.stdout.write('LICENSE file is available at https://github.com/pybee/batavia/blob/master/LICENSE\n')
    sys.stdout.write('\n')
    credits()
    sys.stdout.write('\n')
    copyright()
}

license.__doc__ = 'license()\n\nPrompt printing the license text, a list of contributors, and the copyright notice'
license.$pyargs = true
