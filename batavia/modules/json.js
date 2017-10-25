var enc = require('./json/encoder.js')
var dec = require('./json/decoder.js')

module.exports = {
    __doc__: '',
    __file__: 'batavia/modules/json.js',
    __name__: 'json',
    __package__: '',
    'JSONEncoder': enc.JSONEncoder,
    'dumps': enc.dumps,
    'dump': enc.dump,
    'JSONDecoder': dec.JSONDecoder,
    'loads': dec.loads,
    'load': dec.load
}
