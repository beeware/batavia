
export default function hex(number) {
    var int = number.val
    return '0x' + int.toString(16)
}

hex.__name__ = 'hex'
hex.__doc__ = `hex(number) -> string

Return the hexadecimal representation of an integer.

   >>> hex(3735928559)
   '0xdeadbeef'
`
hex.$pyargs = {
    args: ['number']
}
