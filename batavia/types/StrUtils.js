var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;
var BigNumber = require('bignumber.js').BigNumber

function _substitute(format, args){

    var types = require('../types');
    var workingArgs = args.slice();

    function Specfier(fullText, index, args){
        // fullText (str): full specifier including %, might not be legit!
        // index: starting index in the format string
        // args: the remaining available argument s in the conversion

        // returns object containing the specifier object and the remaining unused arguments

        // reference: https://docs.python.org/2/library/stdtypes.html#string-formatting

        this.fullText = fullText; // full text of possible specifier starting with %
        this.index = index; // its position in the format string
        this.parsedSpec = '%'; // the parsed specifier


        // exceptions are handled like this:
            // scan one character at a time
            // if its illegal, throw that error! -> unsupported character
            // if its '*' there needs to be at least 2 args left (one for the * and another for the conversion)
            // if its a conversion there needs to be atleast one left

        this.remainingArgs = args.slice();  // as args are needed, shift them from this array, then return what's left
        this.args = []; // args to be used by this specifier

        // PARSED DATA FOR SPECIFIER
        this.conversionFlags = {
            '#': false,
            '0': false,
            '-': false,
            ' ': false,
            '+': false
        };

        this.fieldWidth = {
            value: '',
            numeric: null
        }

        this.percision = {
            value: '',
            numeric: null
        }

        this.getNextStep = function(nextChar, currStep) {
            // nextChar(str): the next character to be processed
            // currStep(int): the current step we are on.
            // return: nextStep(int): what step we should process nextChar on

            var steps = {
                // regex to search for the FIRST character in each step
                1: /%/, //literal percentage
                2: /[#0-\s\+]/, // conversion flags
                3: /[\d\*]/, // min field width
                4: /[\d\*\.]/, // percision
                5: /[hHl]/, // length modifier (not used)
                6: /[diouxXeEfFgGcrs]/, // conversion type
            }

            for (var s=currStep; s <= 6; s++) {
                // try to make a match
                var re = steps[s];
                if (nextChar.search(re) !== -1) {
                    return s
                }
            }

            // getting here means its an illegal character!
            throw new Error("illegal character")
        } // end getNextStep

        this.step = function(char, step) {
            // nextChar(str): the next character to be processed
            // nextChar is processed under the appropriate step number.

            switch(step) {

                case 1:
                    // handle literal %
                    this.literalPercent = true;
                    break;

                case 2:
                    // conversion flags
                    switch(char) {

                        case '#':
                            this.conversionFlags['#'] = true;
                            break;

                        case '0':
                            // '-' overrides '0'.
                            if (!this.conversionFlags['-']) {
                                this.conversionFlags['0'] = true;
                            };
                            break;

                        case '-':
                            this.conversionFlags['-'] = true;
                            this.conversionFlags['0'] = false;
                            break;

                        case ' ':
                            // '+' overrides ' '
                            if (!this.conversionFlags['+']) {
                              this.conversionFlags[' '] = true
                            };
                            break;

                        case '+':
                            this.conversionFlags['+'] = true;
                            this.conversionFlags[' '] = false;
                            break;

                        default:
                            /* this isn't a python error. I'm just throwing an exception to the
                            * caller that the conversion flag isn't legal
                            */
                            throw new Error("illegal character")
                    } // end inner switch 2
                  break;

              case 3:
                  // min field width
                  if (char === '*') {
                      // there needs to be atleast two args available,
                      // (one for this, another for the actual conversion)

                      // can't be using numerics or have another * already
                      if (this.fieldWidth.value === '' && this.fieldWidth.numeric === null) {

                        var arg = this.remainingArgs.shift(); // grab an arg

                        // arg must be an int
                        if (!types.isinstance(arg, types.Int)) {
                          throw new exceptions.TypeError("* wants int")
                        }

                        // need to have at least one arg left
                        if (this.remainingArgs.length === 0) {
                          throw new exceptions.TypeError("not enough arguments for format string")
                        }
                        this.args.push(arg);

                        this.fieldWidth.value = "*";
                        this.fieldWidth.numeric = false;
                    } else {
                        throw new Error("illegal character")
                    }

                  } else if (!isNaN(char)) {
                      // value is numeric
                      if (this.fieldWidth.numeric !== false) {

                          // assign if null else concatentate
                          this.fieldWidth.value += char;
                          this.fieldWidth.numeric = true;
                      } else {
                          throw new Error("illegal character")
                      }
                  } else {
                      throw new Error("illegal character")
                  } // end if
                  break;

              case 4:
                  // percision
                  if (char === '*') {
                      // can't be using numerics or have another * already
                      if (this.percision.value === '' && this.percision.numeric === undefined) {

                          var arg = this.remainingArgs.shift(); // grab an arg

                          // arg must be an int
                          if (!types.isinstance(arg, types.Int)) {
                              throw new exceptions.TypeError("* wants int")
                          }

                          // need to have at least one arg left
                          if (this.remainingArgs === []) {
                              throw new exceptions.TypeError("not enough arguments for format string")
                          }
                          this.args.push(arg);

                          this.percision.value = "*";
                          this.percision.numeric = false;
                    } else {
                        throw new Error("illegal character")
                    }

                  } else if (!isNaN(char)) {
                      // value is numeric
                      if (this.percision.numeric !== false) {

                          // assign if null else concatentate
                          this.percision.value += char;
                          this.percision.numeric = true;
                      } else {
                          throw new Error("illegal character")
                      }
                  } else if (char !== '.') {
                      throw new Error("illegal character")
                  };
                  break;

              case 5:
                  // length modifier. Skip!
                  break;

              case 6:
                  // conversion type
                  var arg = this.remainingArgs.shift(); // grab an arg
                  if (arg === undefined) {
                      throw new exceptions.TypeError("not enough arguments for format string")
                  }
                  this.args.push(arg);
                  this.conversionType = char;
                  break;

            } // end switch

        } // end this.step

        this.transform = function() {

            function validateType(arg, conversion) {
              // arg: the arg to be subsituted in
              // conversion(str): the type of conversion to perform
              // throws an error if the arg is an invalid type

                if (/[diouxX]/.test(conversion)) {

                    if (!types.isinstance(arg, [types.Int, types.Float])) {
                        throw new exceptions.TypeError(`%${conversion} format: a number is required, not str`)
                    }
                  } else if (/[eEfFgG]/.test(conversion)) {
                      if (!types.isinstance(arg, [types.Float, types.Int])) {
                          throw new exceptions.TypeError("a float is required")
                      }
                  } else if (conversion === 'c') {
                      // there might be a problem with the error
                      // message from C Python but floats ARE allowed.
                      //  multi character strings are not allowed
                      if (types.isinstance(arg, types.Str) && arg.valueOf().length > 1) {
                          throw new exceptions.TypeError("%c requires int or char")
                      } else if (types.isinstance(arg, [types.Int, types.Float])) {

                          if (arg < 0) {
                              throw new exceptions.OverflowError("%c arg not in range(0xXXXXXXXX)")
                          }
                      }

                } // end outer if
                // conversion types s and r are ok with anything
            } // end validateType

            function getJSValue(bataviaType) {
                // bataviaType: a batavia type, must be int, float or str
                // returns the underlying JS type.
                switch (type_name(bataviaType)) {

                    case ("int"):
                        return bataviaType.bigNumber().toFixed();
                        break;

                    case ("bytes"):
                    case ("bytearray"):
                    case ("slice"):
                        return bataviaType.__repr__();
                        break;

                    case("type"):
                        // TODO need to include name space of class if needed
                        return bataviaType.__repr__();
                        break;

                    case("NoneType"):
                        return 'None';
                        break;

                    case("NotImplementedType"):
                        return "NotImplemented"
                        break;

                    default:
                      return bataviaType.valueOf();
                      break;
                };

            }

            function zeroPadExp(rawExponential) {
                // rawExponential (str) example: "5e+5"
                // returns the correct zero padded exponential. example 5e+05

                var re = /([-+]?[0-9]*\.?[0-9]*)(e[\+\-])(\d+)/;
                var m = rawExponential.match(re);
                if (m[3] < 10) {
                    return m[1] + m[2] + '0' + m[3];
                } else {
                    return m[1] + m[2] + m[3];
                }
            } // end zeroPadExp

            var workingArgs = this.args.slice();

            if (this.fieldWidth.value === '*') {
                var minWidth = workingArgs.shift().valueOf();
            } else if (!isNaN(this.fieldWidth.value )) {
                var minWidth = Number(this.fieldWidth.value);
            } else {
                var minWidth = 0;
            }

            if (this.percision.value === '*') {
                var percision = workingArgs.shift().valueOf();
            } else if (this.percision.value !== '') {
                var percision = Number(this.percision.value);
            } else {
                var percision = null;
            }

            var conversionArgRaw = workingArgs.shift(); // the python representation of the arg
            validateType(conversionArgRaw, this.conversionType);

            var conversionArgValue = getJSValue(conversionArgRaw);

            // floats with no decimal: preserve!
            if (types.isinstance(conversionArgRaw, types.Float) && conversionArgValue % 1 == 0) {
                conversionArgValue = conversionArgValue.toFixed(1)
            }

            switch(this.conversionType) {

                case('d'):
                case('i'):
                case('u'):

                    var conversionArg = new BigNumber(conversionArgValue).toFixed(0);

                    if (conversionArg == '-0') {
                        conversionArg = '0';
                    }

                    // percision determines leading 0s
                    var numLeadingZeros = percision - conversionArg.length;
                    if (numLeadingZeros > 0) {
                        conversionArg = '0'.repeat(numLeadingZeros) + conversionArg;
                    }
                    break;

                case('o'):
                    var base = new BigNumber(conversionArgValue)
                                .abs()
                                .floor()
                                .toString(8)

                    if (base == '-0') {
                        base = '0';
                    }

                    if (this.conversionFlags['#']) {
                        var conversionArg = '0o' + base;
                    } else {
                        var conversionArg = base;
                    }

                    // handle the minus sign
                    if (conversionArgValue <= -1) {
                        conversionArg = '-' + conversionArg;
                    }

                    // percision determines leading 0s
                    var numLeadingZeros = percision - String(base).length;
                    if (numLeadingZeros > 0) {
                        conversionArg = '0'.repeat(numLeadingZeros) + conversionArg;
                    }
                    break;

                case('x'):
                case('X'):

                    var base = new BigNumber(conversionArgValue)
                                .abs()
                                .floor()
                                .toString(16)

                    if (this.conversionType == 'X') {
                        base = base.toUpperCase();
                    }

                    if (base == '-0') {
                        base = '0';
                    }

                    if (this.conversionFlags['#']) {
                        var conversionArg = '0' + this.conversionType + base;
                    } else {
                        var conversionArg = base;
                    }

                    // handle the minus sign
                    if (conversionArgValue <= -1) {
                        conversionArg = '-' + conversionArg;
                    }

                    // percision determines leading 0s
                    var numLeadingZeros = percision - String(base).length;
                    if (numLeadingZeros > 0) {
                        conversionArg = '0'.repeat(numLeadingZeros) + conversionArg;
                    }
                    break;

                case('e'):
                case('E'):

                    var argValueBig = new BigNumber(conversionArgValue)
                    var argExp = Number(argValueBig).toExponential();

                    var expSplit = argExp.split('e');
                    var baseRaw = new BigNumber((expSplit[0]));

                    // might need to add extra zeros to base
                    if (percision !== null) {
                        var base = baseRaw.toFixed(percision);
                    } else {
                        var base = baseRaw.toFixed(6);
                    }

                    var exp = expSplit[1]

                    var conversionArg = this.conversionType === 'e' ?
                        zeroPadExp(`${base}e${exp}`) :
                        zeroPadExp(`${base}e${exp}`).replace(/e/, 'E')

                    break;

                case('g'):
                case('G'):
                    var conversionExp = Number(conversionArgValue).toExponential();
                    var baseExpSplit = conversionExp.split('e')

                    var bn = new BigNumber(conversionArgValue);

                    var base = baseExpSplit[0];

                    var exp = baseExpSplit[1];
                    var expSign = exp > 0 ? "+" : "-";

                    percision = percision || 6;  // percision defaults to 6

                    if (exp < -4 || exp >= percision) {
                        // use the exponential
                        // correctly zero pad the base
                        // use a decimal if alternate format or if one is needed
                        if (this.conversionFlags['#'] || base % 1 != 0) {
                            var base = percision === null || percision === 0 ?
                              Number(base).toFixed(5) : // one's place + 5 decimals = 6 (default)
                              Number(base).toFixed(percision - 1);

                        } else {
                            // don't use alternate format
                            var base = Number(base);
                        }
                        var conversionArg = this.conversionType === 'g' ?
                        zeroPadExp(`${base}e${exp}`) :
                        zeroPadExp(`${base}e${exp}`).replace(/e/, 'E')
                        break;

                    } else {
                        // don't use exponential

                        if (this.conversionFlags['#']) {
                            // The alternate form causes the result to always contain a
                            // decimal point, and trailing zeroes are not removed as they
                            // would otherwise be.

                            // The precision determines the number of significant digits
                            //before and after the decimal point and defaults to 6.

                            // if its an int, tack on a `.` + zeros
                            // if its a float just tack on zeros
                            // get number of digits inherent in the value
                            var isInt = conversionArgValue % 1 === 0;

                            var conversionArgAbsolute = Math.abs(conversionArgValue);

                            if (isInt) {
                                // its an integer
                                var numInherentDigits = String(conversionArgAbsolute).length
                            } else {
                                var numInherentDigits = String(conversionArgAbsolute).length - 1 // exclude the decimal

                                if (conversionArgAbsolute < 1) {
                                    numInherentDigits -= 1 // the leading 0 is not significant
                                }
                            }

                            // how many extra digits?
                            var extraDigits = percision !== null ?
                                percision - numInherentDigits :
                                6 - numInherentDigits;

                            // less than 0 makes no sense!
                            if (extraDigits < 0) {
                                extraDigits = 0;
                            }

                            if (isInt) {
                                var conversionArg = `${Number(conversionArgValue)}.${'0'.repeat(extraDigits)}`
                            } else {
                                var conversionArg = conversionArgValue + '0'.repeat(extraDigits)
                            }

                        } else {
                            // non alternate format
                            var conversionArg = String(Number(conversionArgValue));
                        }
                    } // outer if
                    break;
                case('f'):
                case('F'):
                    conversionArg = percision !== null ?
                        new BigNumber(conversionArgValue).toFixed(percision) :
                        new BigNumber(conversionArgValue).toFixed(6);
                    break;

                case('c'):

                    // NOTE: in C Python there is an upper bound to what int or float can be provided
                    // and this is platform specific. currently, Batavia is not enforcing any
                    // kind of upper bound.

                    if (types.isinstance(conversionArgRaw, [types.Int, types.Float])) {
                        var conversionArg = String.fromCharCode(Number(conversionArgValue));
                    } else {
                        var conversionArg = conversionArgValue;
                    }
                    break;

                case('r'):
                    if (types.isinstance(conversionArgRaw, types.Str)) {
                        var conversionArg = `'${conversionArgValue}'`
                    } else {
                        // handle as a number
                        // if exponent would be < -4 use exponential

                        var asExp = Number(conversionArgValue).toExponential();

                        if (Number(asExp.split('e')[1]) < -4) {
                            var conversionArg = zeroPadExp(asExp);
                        } else {
                            var conversionArg = conversionArgValue
                        }
                    }
                    break;
                case('s'):
                    if (types.isinstance(conversionArgRaw, types.Str)) {
                        var conversionArg = conversionArgValue;

                    } else {
                        // handle as a number
                        // if exponent would be < -4 use exponential

                        var asExp = Number(conversionArgValue).toExponential();

                        if (Number(asExp.split('e')[1]) < -4) {
                            var conversionArg = zeroPadExp(asExp);
                        } else {
                            var conversionArg = conversionArgValue
                        }
                    }
                    break;
            } // end switch

            // only do the below for numbers
            if (types.isinstance(conversionArgRaw, [types.Int, types.Float])) {
                if (this.conversionFlags[' ']) {
                    // A blank should be left before a positive number (or empty string)
                    // produced by a signed conversion.
                    conversionArg = conversionArgValue >= 0 ?
                    ` ${conversionArg}` : `${conversionArg}`;
                } else if (this.conversionFlags['+']) {
                    // sign character should proceed the conversion
                    conversionArg = conversionArgValue >= 0 ?
                    `+${conversionArg}` : `${conversionArg}`;
                }
            }
            var cellWidth = Math.max(minWidth, conversionArg.length);

            var padSize = cellWidth - conversionArg.length;
            if (this.conversionFlags['0'] && types.isinstance(conversionArgRaw, [types.Int, types.Float])) {
                // example: '00005'
                var retVal = '0'.repeat(padSize) + conversionArg;

            } else if (this.conversionFlags['-']) {
                // exmaple:  '00005     '
                var retVal = conversionArg + ' '.repeat(padSize);
            } else {
                // example: '   0005'
                var retVal = ' '.repeat(padSize) + conversionArg;
            }

            return retVal;
        } // END TRANSFORM

        var nextStep = 1;
        var charArray = this.fullText.slice(1).split('')
        var charIndex = 0;
        // SPECIFIER MAIN LOOP
        while(charIndex < charArray.length && !this.literalPercent) {
          var nextChar = charArray[charIndex];
          this.parsedSpec += nextChar;
          try {
            var nextStep = this.getNextStep(nextChar, nextStep)
            this.step(nextChar, nextStep)
          } catch(err) {
            if (err.message === 'illegal character') {
              var charAsHex = nextChar.charCodeAt(0).toString(16)
              throw new exceptions.ValueError(`unsupported format character '${nextChar}' (0x${charAsHex}) at index ${charIndex + index + 1}`)
            } else {
              //its some other error
              throw err
            }
          }

          charIndex++;
          if (nextStep === 6) {
            break;
          }
        } // end while loop

        // check that a conversion type was found. Otherwise throw error!
        if (this.conversionType === undefined && !this.literalPercent) {
          throw new exceptions.ValueError("incomplete format")
        }; // end parse main loop


    } // END SPECIFIER

    var result = '';
    var lastStop = 0

    const re = /(%.+?)(\s|$)/g // grabs any chunk starting with %
    var match = re.exec(format);

    while(match){
        // grab everything between lastStop and current spec start
        result += format.slice(lastStop, match.index);
        // parse the specifier. DON'T ASSUME IT IS COMPLETE OR LEGIT!
        var specObj = new Specfier(match[1], match.index, workingArgs);

        // do the substitution
        if (!specObj.literalPercent) {
            result += specObj.transform();
            // update end of current specifier
            lastStop = match.index + specObj.parsedSpec.length;
            workingArgs = specObj.remainingArgs;
        } else {
            result += match[1];
            lastStop = match.index + match[1].length;
        }
        var match = re.exec(format);
    }

    if (workingArgs.length !== 0) {
        // its ok to having arguments left over if they are any of the below

        workingArgs.forEach(function(arg) {
            if (!types.isinstance(arg, [types.Bytes, types.Bytearray, types.Dict,
                types.List, types.Range])) {
                throw new exceptions.TypeError("not all arguments converted during string formatting")
            }
        })

    }

    // get the last part of the string
    result += format.slice(lastStop, format.length)
    return result;

} // end _substitute

/**************************************************
 * Module exports
 **************************************************/

exports._substitute = _substitute
