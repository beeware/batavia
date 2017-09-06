/**********************************************************************
 * Python core
 **********************************************************************/
var core = {}

core['constants'] = require('./core/constants')
core['version'] = require('./core/version')

core['Block'] = require('./core/types/Block')
core['Cell'] = require('./core/types/Cell')
core['Frame'] = require('./core/types/Frame')
core['PYCFile'] = require('./core/types/PYCFile')

core['Object'] = require('./core/types/Object')
core['Type'] = require('./core/types/Type').Type
core['type_name'] = require('./core/types/Type').type_name
core['create_pyclass'] = require('./core/types/Type').create_pyclass

core['exceptions'] = require('./core/exceptions')
core['callables'] = require('./core/callables')
core['native'] = require('./core/native')

core['NoneType'] = require('./core/types/NoneType').NoneType
core['NotImplementedType'] = require('./core/types/NotImplementedType').NotImplementedType

// Expose singleton constants of core types.
core['None'] = require('./core/types/NoneType').None
core['NotImplemented'] = require('./core/types/NotImplementedType').NotImplemented

module.exports = core
