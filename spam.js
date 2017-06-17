var substitute = require('./batavia/types/StrUtils')._new_subsitute
const types = require('./batavia/types')

// str = new types.Str("{:*>11}")
// const args = new types.Tuple([new types.Str("spam")])
// substitute(str, args)

// HOW TO MAKE A DICT!
// pair1 = new Tuple(['s', 'spam'])
// pair2 = new Tuple(['e','eggs'])
// pairs = [pair1, pair2]
// d2 = new types.Dict(new types.Tuple([pair1, pair2]))
// console.log(d2);
// console.log(d.__getitem__("s"));

var BigNumber = require('bignumber.js').BigNumber

const n = 123456789
const precision = 5

const zeroPadExp = function(rawExponential) {
    // rawExponential (str) example: "5e+5"
    // returns the correct zero padded exponential. 
      // must have lowercase 'e': example 5e+05
    var re = /([-+]?[0-9]*\.?[0-9]*)(e[+-])(\d+)/
    var m = rawExponential.match(re)
    if (m[3] < 10) {
        return m[1] + m[2] + '0' + m[3]
    } else {
        return m[1] + m[2] + m[3]
    }
} // end zeroPadExp

const toExp = function(n, precision, conversionType) {
    /*
        convert a number to its exponential value`
        n(int): the number to convert
        precision(int): the precision to use
        conversionType(str): the type of conversion to use (either 'e' or 'E')

        return the converted exponential (str)
    */

    const nBig = new BigNumber(n)
    const nExp = Number(nBig).toExponential()

    const expSplit = nExp.split('e')
    const baseRaw = new BigNumber((expSplit[0]))

    // might need to add extra zeros to base
    let base
    if (precision !== null) {
        base = baseRaw.toFixed(precision)
    } else {
        base = baseRaw.toFixed(6)
    }
    const exp = expSplit[1] // the exponent bit

    let conversionArg
    if (conversionType === 'e') {
        conversionArg = zeroPadExp(base + 'e' + exp)
    } else {
        conversionArg = zeroPadExp(base + 'e' + exp).replace(/e/, 'E')
    }

    return conversionArg
}

console.log(toExp(n, precision, 'e'));
