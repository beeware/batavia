import * as enc from './json/encoder'
import * as dec from './json/decoder'

export var json = {
    '__doc__': '',
    '__file__': 'batavia/modules/json.js',
    '__name__': 'json',
    '__package__': '',

    'JSONEncoder': enc.JSONEncoder,
    'dumps': enc.dumps,
    'dump': enc.dump,

    'JSONDecoder': dec.JSONDecoder,
    'loads': dec.loads,
    'load': dec.load
}
