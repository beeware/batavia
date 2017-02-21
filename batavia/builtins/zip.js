var types = require('../types')

function zip(args, undefined) {
    if (args === undefined) {
        return new types.List()
    }

    var minLen = Math.min.apply(null, args.map(function(element) {
        return element.length
    }))

    if (minLen === 0) {
        return new types.List()
    }

    var result = new types.List()
    for (var i = 0; i < minLen; i++) {
        var sequence = []
        for (var iterableObj = 0; iterableObj < args.length; iterableObj++) {
            sequence.push(args[iterableObj][i])
        }

        result.push(new types.Tuple(sequence))
    }

    return result
}
zip.__doc__ = 'zip(iter1 [,iter2 [...]]) --> zip object\n\nReturn a zip object whose .__next__() method returns a tuple where\nthe i-th element comes from the i-th iterable argument.  The .__next__()\nmethod continues until the shortest iterable in the argument sequence\nis exhausted and then it raises StopIteration.'

module.exports = zip
