var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;
var BigNumber = require('bignumber.js').BigNumber

function _substitute(format, args){
  var types = require('../types');
  var workingArgs = args.slice();

  function Specfier(fullText, index, args){
    // fullText (str): full specifier including %
    // index: starting index in the format string
    // args: the remaining available arguments in the conversion

    // returns object containing the specifier object and the remaining unused arguments

    // ORDER OF SPECIFIERS
    // 0) The '%' character, which marks the start of the specifier.
    // 1) Mapping key (optional), consisting of a parenthesised sequence of characters (for example, (somename)).
    // 2) Conversion flags (optional), which affect the result of some conversion types.
      // # the value conversion will use the "alternate form" (where defined below) specific alternate form differs by conversion type
      // '0' conversion is 0 padded for numerics
      // - conversion is left adjusted (overrides 0)
      // ' '(space) a blank should be left before positive number or empty string produced by sign conversion
      // '+' positive or negative will precede the conversion (overrides space)


    // 3) Minimum field width (optional). If specified as an '*' (asterisk), the actual width is read from the next element of the tuple in values, and the object to convert comes after the minimum field width and optional precision.
    // 4) Precision (optional), given as a '.' (dot) followed by the precision. If specified as '*' (an asterisk), the actual width is read from the next element of the tuple in values, and the value to convert comes after the precision.
    // 5) Length modifier (optional). IGNORED IN PYTHON
    // 6) Conversion type.

    this.fullText = fullText; // full text starting with %
    this.index = index; // its position in the format string
    this.parsedSpec = '%'; // the parsed specifier


    // exceptions are thrown like this:
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

    this.getNextStep = function(nextChar, currStep){
      // nextChar(str): the next character to be processed
      // currSte(int): the current step we are on.
      // return: nextStep(int): what step we should process nextChar on

      var steps = {
        // regex to search for the FIRST character in each step
        1: /%/ //literal percentage
        2: /[#0-\s\+]/, // conversion flags
        3: /[\d\*]/, // min field width
        4: /[\d\*\.]/, // percision
        5: /[hHl]/, // length modifier (not used)
        6: /[diouxXeEfFgGcrs]/, // conversion type
      }

      for (var s=currStep; s<=7; s++){
        // try to make a match
        var re = steps[s];
        if (nextChar.search(re) !== -1){
          return s
        }
      }

      // getting here means its an illegal character!
      throw new Error("illegal character")
    } // end getNextStep

    this.step = function(char, step){
      // nextChar(str): the next character to be processed
      // nextChar is processed under the appropriate step number.

      // role step into one function, not object of function
      switch(step){

        case 1:
          // handle literal %
          this.literalPercent = true;
          break;

        case 2:
          // conversion flags
          switch(char){

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
          if (char === '*'){
            // there needs to be atleast two args available
            // (one for this, another for the conversion)

            // can't be using numerics or have another * already
            if (this.fieldWidth.value === '' && this.fieldWidth.numeric === null){

              var arg = this.remainingArgs.shift(); // grab an arg

              // arg must be an int
              if ( !types.isinstance(arg, types.Int) ){
                throw new exceptions.TypeError("* wants int")
              }

              // need to have at least one arg left
              if ( this.remainingArgs.length === 0 ){
                throw new exceptions.TypeError("not enough arguments for format string")
              }
              this.args.push(arg);

              this.fieldWidth.value = "*";
              this.fieldWidth.numeric = false;
            } else {
              throw new Error("illegal character")
            }

          } else if (!isNaN(char)){
            // value is numeric
            if ( this.fieldWidth.numeric !== false ){

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
          if (char === '*'){
            // can't be using numerics or have another * already
            if (this.percision.value === '' && this.percision.numeric === undefined){

              var arg = this.remainingArgs.shift(); // grab an arg

              // arg must be an int
              if ( !types.isinstance(arg, types.Int) ){
                throw new exceptions.TypeError("* wants int")
              }

              // need to have at least one arg left
              if ( this.remainingArgs === [] ){
                throw new exceptions.TypeError("not enough arguments for format string")
              }
              this.args.push(arg);

              this.percision.value = "*";
              this.percision.numeric = false;
            } else {
              throw new Error("illegal character")
            }

          } else if ( !isNaN(char) ){
            // value is numeric
            if ( this.percision.numeric !== false ){

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
          if ( this.remainingArgs === [] ){
            throw new exceptions.TypeError("not enough arguments for format string")
          }
          this.args.push(arg);
          this.conversionType = char;
          break;

      } // end switch

    } // end this.step

    this.transform = function(){

      function validateType(arg, conversion){
        // arg: the arg to be subsituted in
        // conversion(str): the type of conversion to perform
        // throws an error if the arg is an invalid type

        if ( /[diouxXeE]/.test(conversion) ){

          if ( !types.isinstance(arg, [types.Int, types.Float]) ){
            throw new exceptions.TypeError(`%${conversion} format: a number is required, not str`)
          }
        } else if ( /[fFgG]/.test(conversion)   ){
          if ( !types.isinstance(arg, [types.Float]) ){
            throw new exceptions.TypeError("a float is required")
          }
        } else if ( conversion === 'c' ){
          // this might be an error in C Python but floats ARE allowed.
          //  multi character strings are not allowed
          if ( types.isinstance(arg, types.Str) && arg.valueOf().length > 1 ){
            throw new exceptions.TypeError("%c requires int or char")
          }
        }

        // conversion types s and r are ok with anything
      } // end validateType

      // returns the substituted string

      var workingArgs = this.args.slice();


      if ( this.fieldWidth.value === '*' ){
        var minWidth = workingArgs.shift().valueOf();
      } else if ( !isNaN(this.fieldWidth.value ) ){
        var minWidth = Number(this.fieldWidth.value);
      } else {
        var minWidth = 0;
      }

      if ( this.percision.value === '*' ){
        var percision = workingArgs.shift().valueOf();
      } else if ( !isNaN(this.percision.value ) ){
        var percision = Number(this.percision.value);
      } else {
        var percision = null;
      }

      var conversionArgRaw = workingArgs.shift(); // the python representation of the arg
      validateType(conversionArgRaw, this.conversionType);

      var conversionArgValue = conversionArgRaw.valueOf(); // the native type

      switch(this.conversionType){
        // handle the #

        case('d'):
        case('i'):
        case('u'):
          var conversionArg = String(parseInt(conversionArgValue));

          // percision determines leading 0s
          var numLeadingZeros = percision - conversionArg.length;
          if ( numLeadingZeros > 0 ){
            conversionArg = '0'.repeat(numLeadingZeros) + conversionArg;
          }
          break;

        case('o'):
          var base = parseInt(Math.abs(conversionArgValue)).toString(8);
          if (this.conversionFlags['#']){
            var conversionArg = '0o' + base;
          } else {
            var conversionArg = base;
          }

          // percision determines leading 0s
          var numLeadingZeros = percision - String(base).length;
          if ( numLeadingZeros > 0 ){
            conversionArg = '0'.repeat(numLeadingZeros) + conversionArg;
          }
          break;

        case('x'):
        case('X'):
          var base = this.conversionType == 'x' ?
            parseInt(conversionArgValue).toString(16) :
            parseInt(conversionArgValue).toString(16).toUpperCase()
          if (this.conversionFlags['#']){
            var conversionArg = '0' + this.conversionType +  base;
          } else {
            var conversionArg = base;
          }

          // percision determines leading 0s
          var numLeadingZeros = percision - String(base).length;
          if ( numLeadingZeros > 0 ){
            conversionArg = '0'.repeat(numLeadingZeros) + conversionArg;
          }
          break;

        case('e'):
        case('E'):

          // toExponential() will almost work here, but the digit here
          // has a minimum of 1 zero pad
          // example: 5 = '5.000000e+00'
          var argValueBig = new BigNumber(conversionArgValue)
          var argExp = Number(argValueBig).toExponential();

          var expSplit = argExp.split('e');
          var baseRaw = new BigNumber((expSplit[0]));

          // this is a string!
          if ( percision !== null ){
            var base = baseRaw.toFixed(percision);
          } else {
            var base = baseRaw.toFixed(6);
          }

          // exponent must have at least two digits
          var exp = expSplit[1]
          if ( exp.length === 2 ){
            exp = exp[0] + '0' + exp[1];
          }

        var conversionArg = this.conversionType === 'e' ?
          `${base}e${exp}` :
          `${base}E${exp}`
          break;

        case('g'):
        case('G'):
          var conversionExp = conversionArgValue.toExponential(6);
          baseExpSplit = conversionExp.split(/e[\+\-]/)
          var exp = Number(baseExpSplit[1]);
          if ( exp < -4 || !exp < percision){
            // use exponential
            if ( baseExpSplit[1].length === 1 ){
              baseExpSplit[1] = '0' + baseExpSplit[1]
            }

            var numLeadingZeros = percision - conversionArg.length;
            if ( numLeadingZeros > 0 ){
              baseExpSplit[0] = baseExpSplit[0] + '0'.repeat(numLeadingZeros)
            }

            var conversionArg = this.conversionType === 'g' ?
              baseExpSplit.join('+e') :
              baseExpSplit.join('+E')
          } else {
            // don't use exponential

            if (this.conversionFlags['#']){
              // The alternate form causes the result to always contain a
              // decimal point, and trailing zeroes are not removed as they
              // would otherwise be.

              // The precision determines the number of significant digits
              //before and after the decimal point and defaults to 6.

              var beforeDecimal = Math.floor(conversionArgValue);
              var afterDecimal = conversionArgValue % 1;
              var afterDecimalLen = this.percision.value !== '' ?
                percision - String(beforeDecimal).length : 6;

              var numExtraZeros = afterDecimalLen - String(afterDecimal).length;
              var conversionArg = `${beforeDecimal}.${afterDecimal + '0'.repeat(numExtraZeros)}`

            } else {

              var conversionArg = conversionArgValue;
            }
          } // outer if
          break;
        case('f'):
        case('F'):

          var beforeDecimal = Math.floor(conversionArgValue);
          var afterDecimal = conversionArgValue % 1;
          afterDecimalLen = percision !== null ?
            percision - String(beforeDecimal).length : 6

          var numExtraZeros = afterDecimalLen - String(afterDecimal).length;
          var conversionArg = `${beforeDecimal}.${afterDecimal + '0'.repeat(numExtraZeros)}`
          break;

        case('c'):
          conversionArg = conversionArgValue;
        case('r'):
          conversionArg = typeof conversionArgValue === 'string' ?
            `'${conversionArgValue}'` : conversionArgValue;
          break;
        case('s'):
          conversionArg = conversionArgValue;
          break;
      } // end switch

      // only do the below for numbers
      if ( typeof conversionArgValue === 'number' ){
        if ( this.conversionFlags[' '] ) {
          // A blank should be left before a positive number (or empty string)
          // produced by a signed conversion.
          conversionArg = conversionArgValue >= 0 ?
          ` ${conversionArg}` : `-${conversionArg}`;
        } else if ( this.conversionFlags['+'] ){
          // sign character should proceed the conversion
          conversionArg = conversionArgValue >= 0 ?
          `+${conversionArg}` : `-${conversionArg}`;
        }
      }

      var cellWidth = Math.max(minWidth, conversionArg.length);
      var padSize = cellWidth - conversionArg.length;
      // var percisionPaddingSize = (percision - conversionArg.length) > 0 ?
      //   percision - conversionArg.length : 0;
      // var whiteSpaceSize = cellWidth - percisionPaddingSize - conversionArg.length;

      if ( this.conversionFlags['0'] && typeof conversionArgValue === 'number' ){
        // example: '00005'
        var retVal = '0'.repeat(padSize) + conversionArg;

      } else if ( this.conversionFlags['-'] ){
        // exmaple:  '00005     '
        var retVal = conversionArg + ' '.repeat(padSize);
      } else {
        // example: '   0005'
        var retVal = ' '.repeat(padSize) + conversionArg;
      }

      return retVal;


    } // end transform

    var nextStep = 1;
    var charArray = this.fullText.slice(1).split('')
    var charIndex = 0;
    // SPECIFIER MAIN LOOP
    while( charIndex < charArray.length && !this.literalPercent ){
      var nextChar = charArray[charIndex];
      this.parsedSpec += nextChar;
      try {

        var nextStep = this.getNextStep(nextChar, nextStep)
        this.step(nextChar, nextStep)
      } catch(err){
        var charAsHex = nextChar.charCodeAt(0).toString(16)
        if (err.message === 'illegal character'){
          throw new exceptions.ValueError(`unsupported format character '${nextChar}' (0x${charAsHex}) at index ${charIndex + index + 1}`)
        } else {
          //its some other error
          throw err
        }
      }

      charIndex++;
      if ( nextStep === 6 ){
        break;
      }
    } // end while loop
    // check that a conversion type was found. Otherwise throw error!
    if ( this.conversionType === undefined && !this.literalPercent ) {
      throw new exceptions.ValueError("incomplete format")
    }; // end parse main loop


  } // END SPECIFIER

  var result = '';
  var lastStop = 0

  // const re = /%+[^%]*?[diouxXeEfFgGcrs]/g;
  const re = /(%.+?)(\s|$)/g // grabs any chunk starting with %
  var match = re.exec(format);
  // spec = specGen.next().value
  while(match){
    console.log(match);
    // grab everything between lastStop and current spec start
    result += format.slice(lastStop, match.index);
    // parse the specifier. DON'T ASSUME IT IS COMPLETE OR LEGIT!
    var specObj = new Specfier(match[1], match.index, workingArgs);

    // do the substitution
    result += specObj.transform();
    // update end of current specifier
    lastStop = match.index + specObj.parsedSpec.length;
    workingArgs = specObj.remainingArgs;

    var match = re.exec(format);
  }

  if ( workingArgs.length !== 0 ){
    throw new exceptions.TypeError("not all arguments converted during string formatting")
  }

  // get the last part of the string
  result += format.slice(lastStop, format.length)
  return result;

} // end _substitute

/**************************************************
 * Module exports
 **************************************************/

exports._substitute = _substitute
