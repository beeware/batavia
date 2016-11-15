
module.exports = function() {
    var exports = {
        'stdout': console.log.bind(console),
        'stderr': console.log.bind(console),
        'core': {
            'builtins': require('./core/builtins'),
            'Block': require('./core/Block'),
            'Cell': require('./core/Cell'),
            'Frame': require('./core/Frame'),
            'PYCFile': require('./core/PYCFile').PYCFile,
        },
        'types': require('./types/_index'),
        'builtins': require('./core/builtins'),
        'modules': require('./modules/_index'),
        'stdlib': require('./modules/stdlib/_index'),
        'VirtualMachine': require('./VirtualMachine'),

    };


    return exports;
}()
