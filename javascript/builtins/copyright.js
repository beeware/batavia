import { sys } from '../modules'

export default function copyright(args, kwargs) {
    sys.stdout.write('Batavia: Copyright (c) 2015 Russell Keith-Magee. (BSD-3 Licence)\n' +
                     'byterun: Copyright (c) 2013, Ned Batchelder. (MIT Licence)\n')
}

copyright.__doc__ = 'copyright()\n\ninteractive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.'
copyright.$pyargs = true
