
module.exports = function() {
    // Set up VM constants
    var batavia = {
        'TEXT_ENCODINGS': {
            ascii : ['ascii', '646', 'us-ascii'],
            latin_1 : ['latin_1', 'latin-1', 'iso-8859-1', 'iso8859-1', '8859',
                       'cp819', 'latin', 'latin1', 'L1'],
            utf_8 : ['utf_8', 'utf-8', 'utf8', 'u8', 'UTF']
        },

        'BATAVIA_MAGIC': null,

        // set in PYCFile while parsing python bytecode
        'BATAVIA_MAGIC_34': String.fromCharCode(238, 12, 13, 10),
        'BATAVIA_MAGIC_35': String.fromCharCode(22, 13, 13, 10),
        'BATAVIA_MAGIC_35a0': String.fromCharCode(248, 12, 13, 10)
    };

    // Configure dependencies
    var BigNumber = require('bignumber.js');
    BigNumber.config({
        DECIMAL_PLACES: 324,
        ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN
    });

    // Set up hooks for stdout and stderr
    batavia['stdout'] = console.log.bind(console);
    batavia['stderr'] = console.log.bind(console);

    // Set up the core interpreter and types.
    batavia['core'] = {
        'builtins': require('./core/builtins'),
        'Block': require('./core/Block'),
        'Cell': require('./core/Cell'),
        'Frame': require('./core/Frame'),
        'PYCFile': require('./core/PYCFile')
    };
    batavia['types'] = require('./types/_index');

    // Set up the modules, including builtins and code from ouroboros
    batavia['builtins'] = require('./core/builtins');
    batavia['modules'] = require('./modules/_index');
    batavia['stdlib'] = require('./modules/stdlib/_index');

    // Lastly, the virtual machine itself.
    batavia['VirtualMachine'] = require('./VirtualMachine');

    return batavia;
}();
