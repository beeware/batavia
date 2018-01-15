import { TypeError } from '../core/exceptions'

export default function hex(number) {
    var int = number.val
    return '0x' + int.toString(16)
}

hex.__doc__ = "hex(number) -> string\n\nReturn the hexadecimal representation of an integer.\n\n   >>> hex(3735928559)\n   '0xdeadbeef'\n"
hex.$pyargs = {
    args: ['number']
}
