import { sys } from '../modules'

export default function copyright() {
    sys.stdout.write('Batavia: Copyright (c) 2015 Russell Keith-Magee. (BSD-3 Licence)\n' +
                     'byterun: Copyright (c) 2013, Ned Batchelder. (MIT Licence)\n')
}

copyright.__name__ = 'copyright'
copyright.__doc__ = `copyright()

interactive prompt objects for printing the license text, a list of
    contributors and the copyright notice.`
copyright.$pyargs = {}
