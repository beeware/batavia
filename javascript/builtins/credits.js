import { sys } from '../modules'

export default function credits() {
    sys.stdout.write('Thanks to all contributors, including those in AUTHORS, for supporting Batavia development. See https://github.com/pybee/batavia for more information\n')
}

credits.__doc__ = 'credits()\n\ninteractive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.'
credits.$pyargs = {}
