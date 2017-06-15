var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var BigNumber = require('bignumber.js').BigNumber

function _substitute(format, args) {
    var types = require('../types')

    // INITIAL SETUP
    // does this conversion use key word or sequential args?
    var kwRe = /%\(/
    var usesKwargs = (format.match(kwRe) !== null)

    // if using kwargs, fail if first arg isn't a dict or more than 1 arg given
    if (usesKwargs && (!types.isinstance(args[0], types.Dict) || args.length !== 1)) {
        throw new exceptions.TypeError.$pyclass('format requires a mapping')
    }

    function Args(workingArgs) {
        // represents either sequential or key word arguments.
        // functions that need to grab arguments interface with this object
        if (usesKwargs) {
            this.collection = workingArgs[0]
        } else {
            this.remainingArgs = workingArgs.slice() // remaining args
        }
    } // end Args

    Args.prototype.getArg = function(key) {
        // get the next arg.
        // if using sequental args, arg is shifted and returned
        // if using kwargs, get value of key
        if (usesKwargs) {
            return this.collection.__getitem__(key)
        }

        return this.remainingArgs.shift()
    }

    Args.prototype.argsRemain = function() {
        // returns if there are args remaining
        if (usesKwargs) {
            return this.collection.keys().length > 0
        } else {
            return this.remainingArgs.length > 0
        }
    }

    var workingArgs = new Args(args)

    function Specfier(fullText, index, args) {
        // fullText (str): full specifier including %, might not be legit!
        // index: starting index in the format string
        // args: the remaining available argument s in the conversion

        // returns object containing the specifier object and the remaining unused arguments

        // reference: https://docs.python.org/2/library/stdtypes.html#string-formatting

        if (usesKwargs) {
            // try to parse the key from this spec
            var keyRe = /\((.+?)\)(.+)/
            var m = fullText.match(keyRe)
            if (m === null) {
                throw new exceptions.ValueError.$pyclass('incomplete format key')
            }
            this.myKey = m[1]
            this.fullText = '%' + m[2]
        } else {
            this.myKey = undefined
            this.fullText = fullText // full text of possible specifier starting with %
        }

        this.index = index // its position in the format string
        this.parsedSpec = '%' // the parsed specifier
        this.usesKwargs = usesKwargs

        // exceptions are handled like this:
            // scan one character at a time
            // if its illegal, throw that error! -> unsupported character
            // if its '*' there needs to be at least 2 args left (one for the * and another for the conversion)
            // if its a conversion there needs to be atleast one left

        this.args = [] // args to be used by this specifier

        // PARSED DATA FOR SPECIFIER
        this.conversionFlags = {
            '#': false,
            '0': false,
            '-': false,
            ' ': false,
            '+': false
        }

        this.fieldWidth = {
            value: '',
            numeric: null
        }

        this.precision = {
            value: '',
            numeric: null
        }

        this.getNextStep = function(nextChar, currStep) {
            // nextChar(str): the next character to be processed
            // currStep(int): the current step we are on.
            // return: nextStep(int): what step we should process nextChar on

            var steps = {
                // regex to search for the FIRST character in each step
                1: /%/, // literal percentage
                2: /[#0-\s+]/, // conversion flags
                3: /[\d*]/, // min field width
                4: /[\d*.]/, // precision
                5: /[hHl]/, // length modifier (not used)
                6: /[diouxXeEfFgGcrs]/ // conversion type
            }

            for (var s = currStep; s <= 6; s++) {
                // try to make a match
                var re = steps[s]
                if (nextChar.search(re) !== -1) {
                    return s
                }
            }

            // getting here means its an illegal character!
            throw new exceptions.TypeError.$pyclass('illegal character')
        } // end getNextStep

        this.step = function(char, step) {
            // nextChar(str): the next character to be processed
            // nextChar is processed under the appropriate step number.
            var arg
            switch (step) {
                case 1:
                    // handle literal %
                    this.literalPercent = true
                    break

                case 2:
                    // conversion flags
                    switch (char) {

                        case '#':
                            this.conversionFlags['#'] = true
                            break

                        case '0':
                            // '-' overrides '0'.
                            if (!this.conversionFlags['-']) {
                                this.conversionFlags['0'] = true
                            };
                            break

                        case '-':
                            this.conversionFlags['-'] = true
                            this.conversionFlags['0'] = false
                            break

                        case ' ':
                            // '+' overrides ' '
                            if (!this.conversionFlags['+']) {
                                this.conversionFlags[' '] = true
                            };
                            break

                        case '+':
                            this.conversionFlags['+'] = true
                            this.conversionFlags[' '] = false
                            break

                        default:
                            /* this isn't a python error. I'm just throwing an exception to the
                            * caller that the conversion flag isn't legal
                            */
                            throw new exceptions.TypeError.$pyclass('illegal character')
                    } // end inner switch 2
                    break

                case 3:
                    // min field width
                    if (char === '*') {
                        // there needs to be atleast two args available,
                        // (one for this, another for the actual conversion)
                        if (this.usesKwargs) {
                            // not allowed with kwargs!
                            throw new exceptions.TypeError.$pyclass('* wants int')
                        }
                        // can't be using numerics or have another * already
                        if (this.fieldWidth.value === '' && this.fieldWidth.numeric === null) {
                            arg = workingArgs.getArg()

                            // arg must be an int
                            if (!types.isinstance(arg, types.Int)) {
                                throw new exceptions.TypeError.$pyclass('* wants int')
                            }

                            // need to have at least one arg left
                            if (this.remainingArgs.length === 0) {
                                throw new exceptions.TypeError.$pyclass('not enough arguments for format string')
                            }
                            this.args.push(arg)

                            this.fieldWidth.value = '*'
                            this.fieldWidth.numeric = false
                        } else {
                            throw new exceptions.TypeError.$pyclass('illegal character')
                        }
                    } else if (!isNaN(char)) {
                        // value is numeric
                        if (this.fieldWidth.numeric !== false) {
                            // assign if null else concatentate
                            this.fieldWidth.value += char
                            this.fieldWidth.numeric = true
                        } else {
                            throw new exceptions.Error.$pyclass('illegal character')
                        }
                    } else {
                        throw new exceptions.Error.$pyclass('illegal character')
                    } // end if
                    break

                case 4:
                    // precision
                    if (char === '*') {
                        if (this.usesKwargs) {
                            // not allowed with kwargs!
                            throw new exceptions.TypeError.$pyclass('* wants int')
                        }
                        // can't be using numerics or have another * already
                        if (this.precision.value === '' && this.precision.numeric === undefined) {
                            arg = workingArgs.getArg()
                            // arg must be an int
                            if (!types.isinstance(arg, types.Int)) {
                                throw new exceptions.TypeError.$pyclass('* wants int')
                            }

                            // need to have at least one arg left
                            if (this.remainingArgs === []) {
                                throw new exceptions.TypeError.$pyclass('not enough arguments for format string')
                            }
                            this.args.push(arg)

                            this.precision.value = '*'
                            this.precision.numeric = false
                        } else {
                            throw new exceptions.TypeError.$pyclass('illegal character')
                        }
                    } else if (!isNaN(char)) {
                        // value is numeric
                        if (this.precision.numeric !== false) {
                            // assign if null else concatentate
                            this.precision.value += char
                            this.precision.numeric = true
                        } else {
                            throw new Error('illegal character')
                        }
                    } else if (char !== '.') {
                        throw new Error('illegal character')
                    };
                    break

                case 5:
                    // length modifier. Skip!
                    break

                case 6:
                    // conversion type
                    arg = workingArgs.getArg(this.myKey)
                    if (arg === undefined) {
                        throw new exceptions.TypeError.$pyclass('not enough arguments for format string')
                    }
                    this.args.push(arg)
                    this.conversionType = char
                    break
            } // end switch
        } // end this.step

        this.transform = function() {
            function validateType(arg, conversion) {
              // arg: the arg to be subsituted in
              // conversion(str): the type of conversion to perform
              // throws an error if the arg is an invalid type

                if (/[diouxX]/.test(conversion)) {
                    if (!types.isinstance(arg, [types.Int, types.Float])) {
                        throw new exceptions.TypeError.$pyclass(`%${conversion} format: a number is required, not str`)
                    }
                } else if (/[eEfFgG]/.test(conversion)) {
                    if (!types.isinstance(arg, [types.Float, types.Int])) {
                        throw new exceptions.TypeError.$pyclass('a float is required')
                    }
                } else if (conversion === 'c') {
                    // there might be a problem with the error
                    // message from C Python but floats ARE allowed.
                    // multi character strings are not allowed
                    if (types.isinstance(arg, types.Str) && arg.valueOf().length > 1) {
                        throw new exceptions.TypeError.$pyclass('%c requires int or char')
                    } else if (types.isinstance(arg, [types.Int, types.Float])) {
                        if (arg < 0) {
                            throw new exceptions.OverflowError.$pyclass('%c arg not in range(0xXXXXXXXX)')
                        }
                    }
                } // end outer if
                // conversion types s and r are ok with anything
            } // end validateType

            function getJSValue(bataviaType) {
                // bataviaType: a batavia type, must be int, float or str
                // returns the underlying JS type.
                switch (type_name(bataviaType)) {
                    case ('int'):
                        return bataviaType.bigNumber().toFixed()

                    case ('bytes'):
                    case ('bytearray'):
                    case ('slice'):
                    case ('bool'):
                        return bataviaType.__repr__()

                    case ('type'):
                        // TODO need to include name space of class if needed
                        return bataviaType.__repr__()

                    case ('NoneType'):
                        return 'None'

                    case ('NotImplementedType'):
                        return 'NotImplemented'

                    default:
                        return bataviaType.valueOf()
                }
            }

            function zeroPadExp(rawExponential) {
                // rawExponential (str) example: "5e+5"
                // returns the correct zero padded exponential. example 5e+05

                var re = /([-+]?[0-9]*\.?[0-9]*)(e[+-])(\d+)/
                var m = rawExponential.match(re)
                if (m[3] < 10) {
                    return m[1] + m[2] + '0' + m[3]
                } else {
                    return m[1] + m[2] + m[3]
                }
            } // end zeroPadExp

            var workingArgs = this.args.slice()
            var minWidth
            if (this.fieldWidth.value === '*') {
                minWidth = workingArgs.shift().valueOf()
            } else if (!isNaN(this.fieldWidth.value)) {
                minWidth = Number(this.fieldWidth.value)
            } else {
                minWidth = 0
            }

            var precision
            if (this.precision.value === '*') {
                precision = workingArgs.shift().valueOf()
            } else if (this.precision.value !== '') {
                precision = Number(this.precision.value)
            } else {
                precision = null
            }

            var conversionArgRaw = workingArgs.shift() // the python representation of the arg
            validateType(conversionArgRaw, this.conversionType)

            var conversionArgValue = getJSValue(conversionArgRaw)
            var conversionArg, base, exp, asExp, numLeadingZeros
            // floats with no decimal: preserve!
            if (types.isinstance(conversionArgRaw, types.Float) && conversionArgValue % 1 === 0) {
                conversionArgValue = conversionArgValue.toFixed(1)
            }

            switch (this.conversionType) {

                case ('d'):
                case ('i'):
                case ('u'):

                    conversionArg = new BigNumber(conversionArgValue).toFixed(0)

                    if (conversionArg === '-0') {
                        conversionArg = '0'
                    }

                    // precision determines leading 0s
                    numLeadingZeros = precision - conversionArg.length
                    if (numLeadingZeros > 0) {
                        conversionArg = '0'.repeat(numLeadingZeros) + conversionArg
                    }
                    break

                case ('o'):
                    base = new BigNumber(conversionArgValue).abs().floor().toString(8)

                    if (base === '-0') {
                        base = '0'
                    }

                    if (this.conversionFlags['#']) {
                        conversionArg = '0o' + base
                    } else {
                        conversionArg = base
                    }

                    // handle the minus sign
                    if (conversionArgValue <= -1) {
                        conversionArg = '-' + conversionArg
                    }

                    // precision determines leading 0s
                    numLeadingZeros = precision - String(base).length
                    if (numLeadingZeros > 0) {
                        conversionArg = '0'.repeat(numLeadingZeros) + conversionArg
                    }
                    break

                case ('x'):
                case ('X'):
                    base = new BigNumber(conversionArgValue).abs().floor().toString(16)

                    if (this.conversionType === 'X') {
                        base = base.toUpperCase()
                    }

                    if (base === '-0') {
                        base = '0'
                    }

                    if (this.conversionFlags['#']) {
                        conversionArg = '0' + this.conversionType + base
                    } else {
                        conversionArg = base
                    }

                    // handle the minus sign
                    if (conversionArgValue <= -1) {
                        conversionArg = '-' + conversionArg
                    }

                    // precision determines leading 0s
                    numLeadingZeros = precision - String(base).length
                    if (numLeadingZeros > 0) {
                        conversionArg = '0'.repeat(numLeadingZeros) + conversionArg
                    }
                    break

                case ('e'):
                case ('E'):

                    var argValueBig = new BigNumber(conversionArgValue)
                    var argExp = Number(argValueBig).toExponential()

                    var expSplit = argExp.split('e')
                    var baseRaw = new BigNumber((expSplit[0]))

                    // might need to add extra zeros to base
                    if (precision !== null) {
                        base = baseRaw.toFixed(precision)
                    } else {
                        base = baseRaw.toFixed(6)
                    }
                    exp = expSplit[1]

                    if (this.conversionType === 'e') {
                        conversionArg = zeroPadExp(base + 'e' + exp)
                    } else {
                        conversionArg = zeroPadExp(base + 'e' + exp).replace(/e/, 'E')
                    }

                    break

                case ('g'):
                case ('G'):
                    var conversionExp = Number(conversionArgValue).toExponential()
                    var baseExpSplit = conversionExp.split('e')

                    base = baseExpSplit[0]
                    exp = baseExpSplit[1]

                    precision = precision || 6  // precision defaults to 6

                    if (exp < -4 || exp >= precision) {
                        // use the exponential
                        // correctly zero pad the base
                        // use a decimal if alternate format or if one is needed
                        if (this.conversionFlags['#'] || base % 1 !== 0) {
                            if (precision === null || precision === 0) {
                                base = Number(base).toFixed(5)
                            } else {
                                base = Number(base).toFixed(precision - 1) // one's place + 5 decimals = 6 (default)
                            }
                        } else {
                            // don't use alternate format
                            base = Number(base)
                        }
                        if (this.conversionType === 'g') {
                            conversionArg = zeroPadExp(`${base}e${exp}`)
                        } else {
                            conversionArg = zeroPadExp(`${base}e${exp}`).replace(/e/, 'E')
                        }
                        break
                    } else {
                        // don't use exponential

                        if (this.conversionFlags['#']) {
                            // The alternate form causes the result to always contain a
                            // decimal point, and trailing zeroes are not removed as they
                            // would otherwise be.

                            // The precision determines the number of significant digits
                            // before and after the decimal point and defaults to 6.

                            // if its an int, tack on a `.` + zeros
                            // if its a float just tack on zeros
                            // get number of digits inherent in the value
                            var isInt = conversionArgValue % 1 === 0

                            var conversionArgAbsolute = Math.abs(conversionArgValue)
                            var numInherentDigits

                            if (isInt) {
                                // its an integer
                                numInherentDigits = String(conversionArgAbsolute).length
                            } else {
                                numInherentDigits = String(conversionArgAbsolute).length - 1 // exclude the decimal

                                if (conversionArgAbsolute < 1) {
                                    numInherentDigits -= 1 // the leading 0 is not significant
                                }
                            }

                            // how many extra digits?
                            var extraDigits
                            if (precision !== null) {
                                extraDigits = precision - numInherentDigits
                            } else {
                                extraDigits = 6 - numInherentDigits
                            }

                            // less than 0 makes no sense!
                            if (extraDigits < 0) {
                                extraDigits = 0
                            }

                            if (isInt) {
                                conversionArg = `${Number(conversionArgValue)}.${'0'.repeat(extraDigits)}`
                            } else {
                                conversionArg = conversionArgValue + '0'.repeat(extraDigits)
                            }
                        } else {
                            // non alternate format
                            conversionArg = String(Number(conversionArgValue))
                        }
                    } // outer if
                    break
                case ('f'):
                case ('F'):
                    if (precision !== null) {
                        conversionArg = new BigNumber(conversionArgValue).toFixed(precision)
                    } else {
                        conversionArg = new BigNumber(conversionArgValue).toFixed(6)
                    }
                    break

                case ('c'):

                    // NOTE: in C Python there is an upper bound to what int or float can be provided
                    // and this is platform specific. currently, Batavia is not enforcing any
                    // kind of upper bound.

                    if (types.isinstance(conversionArgRaw, [types.Int, types.Float])) {
                        conversionArg = String.fromCharCode(Number(conversionArgValue))
                    } else {
                        conversionArg = conversionArgValue
                    }
                    break

                case ('r'):
                    if (types.isinstance(conversionArgRaw, types.Str)) {
                        conversionArg = `'${conversionArgValue}'`
                    } else {
                        // handle as a number
                        // if exponent would be < -4 use exponential

                        asExp = Number(conversionArgValue).toExponential()

                        if (Number(asExp.split('e')[1]) < -4) {
                            conversionArg = zeroPadExp(asExp)
                        } else {
                            conversionArg = conversionArgValue
                        }
                    }
                    break
                case ('s'):
                    if (types.isinstance(conversionArgRaw, types.Str)) {
                        conversionArg = conversionArgValue
                    } else {
                        // handle as a number
                        // if exponent would be < -4 use exponential

                        asExp = Number(conversionArgValue).toExponential()

                        if (Number(asExp.split('e')[1]) < -4) {
                            conversionArg = zeroPadExp(asExp)
                        } else {
                            conversionArg = conversionArgValue
                        }
                    }
                    break
            } // end switch

            // only do the below for numbers
            if (types.isinstance(conversionArgRaw, [types.Int, types.Float])) {
                if (this.conversionFlags[' ']) {
                    // A blank should be left before a positive number (or empty string)
                    // produced by a signed conversion.
                    if (conversionArgValue >= 0) {
                        conversionArg = ' ' + conversionArg
                    }
                } else if (this.conversionFlags['+']) {
                    // sign character should proceed the conversion
                    if (conversionArgValue >= 0) {
                        conversionArg = '+' + conversionArg
                    }
                }
            }
            var cellWidth = Math.max(minWidth, conversionArg.length)

            var padSize = cellWidth - conversionArg.length
            var retVal
            if (this.conversionFlags['0'] && types.isinstance(conversionArgRaw, [types.Int, types.Float])) {
                // example: '00005'
                retVal = '0'.repeat(padSize) + conversionArg
            } else if (this.conversionFlags['-']) {
                // exmaple:  '00005     '
                retVal = conversionArg + ' '.repeat(padSize)
            } else {
                // example: '   0005'
                retVal = ' '.repeat(padSize) + conversionArg
            }

            return retVal
        } // END TRANSFORM

        // SPECIFIER MAIN LOOP

        var nextStep = 1
        var charArray = this.fullText.slice(1).split('')
        var charIndex = 0
        while (charIndex < charArray.length && !this.literalPercent) {
            var nextChar = charArray[charIndex]
            this.parsedSpec += nextChar
            try {
                nextStep = this.getNextStep(nextChar, nextStep)
                this.step(nextChar, nextStep)
            } catch (err) {
                if (err.msg === 'illegal character') {
                    var charAsHex = nextChar.charCodeAt(0).toString(16)
                    throw new exceptions.ValueError.$pyclass(`unsupported format character '${nextChar}' (0x${charAsHex}) at index ${charIndex + index + 1}`)
                } else {
                  // its some other error
                    throw err
                }
            }

            charIndex++
            if (nextStep === 6) {
                break
            }
        } // end while loop

        // check that a conversion type was found. Otherwise throw error!
        if (this.conversionType === undefined && !this.literalPercent) {
            throw new exceptions.ValueError.$pyclass('incomplete format')
        }; // end parse main loop
    } // END SPECIFIER

    var result = ''
    var lastStop = 0 // as we do each subsitution remember where in string we are scanning
    const re = /(%.+?)(\s|$)/g // grabs any chunk starting with %
    var match = re.exec(format)

    while (match) {
        // grab everything between lastStop and current spec start
        result += format.slice(lastStop, match.index)
        // parse the specifier. DON'T ASSUME IT IS COMPLETE OR LEGIT!
        var specObj = new Specfier(match[1], match.index, workingArgs, usesKwargs)

        // do the substitution
        if (!specObj.literalPercent) {
            result += specObj.transform()
        } else {
            result += match[1]
        }

        lastStop = match.index + specObj.parsedSpec.length
        match = re.exec(format)
    }

    if (workingArgs.length !== 0 && !usesKwargs) {
        // its ok to having arguments left over if they are any of the below

        workingArgs.remainingArgs.forEach(function(arg) {
            if (!types.isinstance(arg, [types.Bytes, types.Bytearray, types.Dict,
                types.List, types.Range])) {
                throw new exceptions.TypeError.$pyclass('not all arguments converted during string formatting')
            }
        })
    }

    // get the last part of the string
    result += format.slice(lastStop, format.length)
    return result
} // end _substitute

function _new_subsitute(str, args, kwargs) {
    /*
      perform new style formatting (str.format)
      args(array): positional arguments
      kwargs(object): keyword arguments.
      both are allowed
    */
    
    var types = require('../types')

    function Mode() {
      // the mode of formatting we are in. Can be:
        // automatic {}
        // manual {0} {1}...
        // keyword {spam} {eggs}...
    }
    Mode.prototype.checkMode = function(text) {
      // set the mode of formatting, or, if a different mode has been set
      // throw an error

      // text(str): the text inside a specifier.
        let newMode
        if (text === '') {
            // manual
            newMode = 'manual field specification'
        } else {
            // automatic (either sequential or keyword)
            newMode = 'automatic field numbering'
        }

        if (this.mode === undefined) {
            // mode may be set
            this.mode = newMode
        } else if (this.mode !== newMode) {
            // mode has already been set. check if it conflicts with set mode
            throw new exceptions.TypeError.$pyclass(`cannot switch from ${this.mode} to ${newMode}`)
        }
    }

    const modeObj = new Mode()
    function Specifier(text, specIndex) {
        this.text = text
        this.specIndex = specIndex // the specifier's position in the original string

        this.fieldName = ''
        this.conversionFlag = ''
        this.formatOptionsRaw = '' // everything after the :, but unparsed
        // these characters denote the begining of a new group

        // init format options
        // each option is edited via a setter which will do one of three things:
            // accept the character and return true
            // raise an error
            // reject the chracter and return false
            
        this.initialParse() // parse characters into groups
        this.parseAlign()
        this.formatParse()  // parse format characters
        process.exit()
    }

    /* FORMAT PARSING METHODS
      each takes a character (str) its index in the str(int) and the array
        itself
      if the method should process the character, it does
        (including any possible errors)
      if it shouldn't process the character it doesn't
      In either case, the method returns an integer representing the next step
        to perform
    */

    Specifier.prototype.initialParse = function() {
        // read characters left to right.
          // if we encounter a !, it marks the start of the conversion flag.
          // if we a : it marks the start of other formatting options

        // group1: the field name
        // group2: the conversion flag
        // group3: all other options
        let currentParseGroup = 1
        let stepMapping = {'!': 2, ':': 3}
        this.text.split('').forEach(function(char, i) {
            // going through the string, assign each character to the right bucket
            // fieldName, conversionFlag or formatOptions
            let newGroup = stepMapping[char] // does char denote a new group?
            if (newGroup) {
                currentParseGroup = newGroup
            }
            switch (currentParseGroup) {
                case 1:
                    this.fieldName += char
                    break
                case 2:
                    // error if trying to add a second character
                    if (this.conversionFlag.length === 1) {
                        throw new exceptions.ValueError.$pyclass("expected ':' after conversion specifier")
                    } else if (char !== '!' ){
                      // don't want the delimiter
                      this.conversionFlag += char                      
                    }
                    break
                case 3:
                    // error if group two === '!'
                    if (this.conversionFlag === '!') {
                        throw new exceptions.ValueError.$pyclass("expected ':' after conversion specifier")
                    } else if (char !== ':') {
                        this.formatOptionsRaw += char
                    }
                    break

            } // end switch
        }, this) // end initial parse
    }

    Specifier.prototype.parseAlign = function() {
      
        /* parsing the formatting options will work quite similarly to old style
          formatting but with one exception.
          the fill character only has meaning if it is followed by an align
          character immedatly after. We will simlpy parse that bit on its own
          then parse the rest like with old style formatting
        */
      
        // look for an alignment character
        const alignRe = /[<^>=]/
        switch (this.formatOptionsRaw.match(alignRe).index) {
            case 0:
                // found align character at index 0
                this.align = this.formatOptionsRaw[0]
                
                // remove that character from the set
                this.formatOptionsRaw = this.formatOptionsRaw.slice(1)
                break
            case 1:
                // found align character at index 1. index 0 is the fill character
                this.fill = this.formatOptionsRaw[0]
                this.align = this.formatOptionsRaw[1]
                
                // remove those character from the set
                this.formatOptionsRaw = this.formatOptionsRaw.slice(2)
                break
            default:
                // no align character
                break
        } // end switch
    }

    // Specifier.prototype.formatParse = function() {
    //     const re = /(#?)(0?)(\d*)(\.?\d+)(.*)/
    //     
    // }
 
    Specifier.prototype.formatParse = function() {
      
      console.log(`parsing ${this.formatOptionsRaw}`)
        
        const getNextStep = function(nextChar, currStep) {
            // nextChar(str): the next character to be processed
            // currStep(int): the current step we are on.
            // return: nextStep(int): what step we should process nextChar on            
            
            var steps = {
                // regex to search for the FIRST character in each step
                1: /[+\- ]/, // sign
                2: /#/, // alternate form
                3: /0/, // zero padding
                4: /\d/, // width
                5: /[,_]/, // grouping
                6: /[.\d]/  // precision
            }

            for (var s = currStep; s <= 6; s++) {
                // try to make a match
                var re = steps[s]
                if (nextChar.search(re) !== -1) {
                    return s
                }
            }
            return 7 // the 7th and final step is the default when nothing else works
            
        } // end getNextStep
        
        
        const step = function(char, step) {
            // process the character under the correct step
            // return what step should be performed next
          
            switch (currStep) {
                case 1:
                    // sign
                    this.sign = char
                    return 2
                case 2:
                    // alternate form
                    this.alternate = char
                    return 3
                case 3:
                    // zero padding
                    this.zeroPad = char
                    return 4
                case 4:
                    // width
                    if (this.width) {
                        this.width += char
                    } else {
                        this.width = char
                    }
                    // don't increment step, there could be another width character.
                    return 4
                    
                case 5:
                    // grouping
                    this.grouping = char
                    return 6
                case 6:
                    // precision
                    if (this.precision) {
                        this.precision += char
                    } else {
                        this.precision = char
                    }
                    // don't increment step, there could be another precision character.
                    return 6

                case 7:
                    // format type. could potentially be multiple characters.
                    // this doesn't make sense but don't throw an error here.
                    if (this.type) {
                        this.type += char
                    } else {
                        this.type = char
                    }
                    return 7
                    // don't increment step, there could be another type character.
            } // switch
        }.bind(this) // step
        
        let currStep = 1 // the current parse step we are on
        this.formatOptionsRaw.split('').forEach(function(char, i, arr) {
            currStep = getNextStep(char, currStep)
            currStep = step(char, currStep)
        }, this)
        
        // console.log("done with formatParse")
        // console.log(`
        //   fill: ${this.fill}
        //   align: ${this.align}
        //   sign: ${this.sign}
        //   alternate: ${this.alternate}
        //   zeroPad: ${this.zeroPad}
        //   width: ${this.width}
        //   grouping: ${this.grouping}
        //   precision: ${this.precision}
        //   type: ${this.type}
        // `)
    }  // formatParse

    Specifier.prototype.convert = function() {
      // text(str): full text of the specifier inside the { }
      // returns the value to be inserted

        modeObj.checkMode(this.fieldName)
        if (this.fieldName === '') {
            const key = new types.Int(this.specIndex)
            return args.__getitem__(key)
        } else if (!isNaN(Number(this.fieldName))) {
            // using sequential arguments
            const key = new types.Int(this.fieldName)
            return args.__getitem__(key)
        } else {
            // using keyword argument
            const key = new types.Str(this.fieldName)
            return kwargs.__getitem__(key)
        }
    }

    const specRe = /{(.*?)}/g
    let match = specRe.exec(str)
    let result = ''
    let lastStop = 0
    let specIndex = -1 // counter for number of specifiers encountered so far
    while (match) {
        // grab everything leading up to specifier
        specIndex++
        result += str.slice(lastStop, match.index)
        var spec = new Specifier(match[1], specIndex)

        result += spec.convert()
        lastStop = match.index + match[1].length + 2
        match = specRe.exec(str)
    }
    result += str.slice(lastStop, str.length)
    return result
}

/**************************************************
 * Module exports
 **************************************************/

exports._substitute = _substitute
exports._new_subsitute = _new_subsitute
