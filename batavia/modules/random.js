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

module.exports = random
