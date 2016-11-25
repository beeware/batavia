/**********************************************************************
 * Python core
 **********************************************************************/
var core = {}

core['constants'] = require('./core/constants');

core['Block'] = require('./core/types/Block');
core['Cell'] = require('./core/types/Cell');
core['Frame'] = require('./core/types/Frame');
core['PYCFile'] = require('./core/types/PYCFile');

core['Object'] = require('./core/types/Object');
core['Type'] = require('./core/types/Type').Type;
core['type_name'] = require('./core/types/Type').type_name;

core['exceptions'] = require('./core/exceptions');
core['callables'] = require('./core/callables');

core['NoneType'] = require('./core/types/NoneType').NoneType;
core['NotImplementedType'] = require('./core/types/NotImplementedType').NotImplementedType;

// Expose singleton constants of core types.
core['None'] = require('./core/types/NoneType').None;
core['NotImplemented'] = require('./core/types/NotImplementedType').NotImplemented;

// Set up hooks for stdout and stderr
core['io'] = {
    'stdout': console.log.bind(console),
    'stderr': console.log.bind(console)
}

module.exports = core;
