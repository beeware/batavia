var Int = require('./types/Int');

module.exports = {
    'stdout': console.log.bind(console),
    'stderr': console.log.bind(console),
    'core': {
        'Block': require('./core/Block').Block,
        'builtins': require('./core/builtins').builtins,
        'Cell': require('./core/Cell').Cell,
        'Frame': require('./core/Frame').Frame,
        'Generator': require('./core/Generator').Generator,
        'PYCFile': require('./core/PYCFile').PYCFile,
    },
    'types': require('./types/_index'),
    'builtins': require('./core/builtins'),
    'modules': require('./modules/_index'),
    'stdlib': require('./modules/stdlib/_index'),
    'VirtualMachine': require('./VirtualMachine'),

    'MAX_FLOAT': new Int("179769313486231580793728971405303415079934132710037826936173778980444968292764750946649017977587207096330286416692887910946555547851940402630657488671505820681908902000708383676273854845817711531764475730270069855571366959622842914819860834936475292719074168444365510704342711559699508093042880177904174497791"),

    // set in PYCFile while parsing python bytecode
    'BATAVIA_MAGIC': null,
    'BATAVIA_MAGIC_34': String.fromCharCode(238, 12, 13, 10),
    'BATAVIA_MAGIC_35': String.fromCharCode(22, 13, 13, 10),
    'BATAVIA_MAGIC_35a0': String.fromCharCode(248, 12, 13, 10),

    /************************
     *  Reusable Constants
     ************************/

    'TEXT_ENCODINGS': {
        ascii : ['ascii', '646', 'us-ascii'],
        latin_1 : ['latin_1', 'latin-1', 'iso-8859-1', 'iso8859-1', '8859',
                   'cp819', 'latin', 'latin1', 'L1'],
        utf_8 : ['utf_8', 'utf-8', 'utf8', 'u8', 'UTF']
    }
}
