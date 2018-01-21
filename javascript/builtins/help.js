import { sys } from '../modules/sys'

export default function help() {
    sys.stdout.write('For help, please see: https://github.com/pybee/batavia.')
}

help.__name__ = 'help'
help.__doc__ = `In Python, this is a wrapper around pydoc.help. In Batavia, this is a link to the README.`
help.$pyargs = {}
