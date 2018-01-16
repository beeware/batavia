var random = {
    '__doc__': '',
    '__file__': 'batavia/modules/random.js',
    '__name__': 'random',
    '__package__': ''
}

random.choice = function(choices) {
    var index = Math.floor(Math.random() * choices.length)
    return choices[index]
}

random.random = function() {
    var types = require('../types')
    return new types.Float(Math.random())
}

module.exports = random
