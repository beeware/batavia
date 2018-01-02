import { TypeError } from '../core/exceptions'
import { None } from '../core/types/none'

import * as types from '../types'

export default function property(args, kwargs) {
    if (args.length === 0) {
        return new types.Property(None, None, None, None)
    } else if (args.length === 1) {
        return new types.Property(args[0], None, None, None)
    } else if (args.length === 2) {
        return new types.Property(args[0], args[1], None, None)
    } else if (args.length === 3) {
        return new types.Property(args[0], args[1], args[2], None)
    } else if (args.length === 4) {
        return new types.Property(args[0], args[1], args[2], args[3])
    } else {
        throw new TypeError.$pyclass('property() takes at most 4 arguments (' + args.length + ' given)')
    }
}

property.__doc__ = 'property(fget=None, fset=None, fdel=None, doc=None) -> property attribute\n\nfget is a export default function to be used for getting an attribute value, and likewise\nfset is a function for setting, and fdel a function for del\'ing, an\nattribute.  Typical use is to define a managed attribute x:\n\nclass C(object):\n    def getx(self): return self._x\n    def setx(self, value): self._x = value\n    def delx(self): del self._x\n    x = property(getx, setx, delx, "I\'m the \'x\' property.")\n\nDecorators make defining new properties or modifying existing ones easy:\n\nclass C(object):\n    @property\n    def x(self):\n        "I am the \'x\' property."\n        return self._x\n    @x.setter\n    def x(self, value):\n        self._x = value\n    @x.deleter\n    def x(self):\n        del self._x\n'
property.$pyargs = true
