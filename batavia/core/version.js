var constants = require('./constants')
var exceptions = require('./exceptions')

var version = {}

var magic_map = {}
magic_map[String.fromCharCode(238, 12, 13, 10)] = [[3, 4], [0xF]]
magic_map[String.fromCharCode(248, 12, 13, 10)] = [[3, 5], [0xA, 0]]
magic_map[String.fromCharCode(22, 13, 13, 10)] = [[3, 5], [0xF]]
magic_map[String.fromCharCode(23, 13, 13, 10)] = [[3, 5, 3], [0xF]]
magic_map[String.fromCharCode(51, 13, 13, 10)] = [[3, 6, 2], [0xF]]

var pattern = /^(\d+(\.\d+)*)((a|b|rc)(\d+))?$/

version.version_id = function(str) {
    var match = pattern.exec(str)
    if (match === null) {
        throw new exceptions.BataviaError('Unexpected version identifier')
    }
    var version = match[1].split('.').map(Number)
    var pre
    switch (match[4]) {
        case 'a':
            pre = [0xA, Number(match[5])]
            break
        case 'b':
            pre = [0xB, Number(match[5])]
            break
        case 'rc':
            pre = [0xC, Number(match[5])]
            break
        default:
            pre = [0xF]
    }
    return [version, pre]
}

version.earlier = function(str) {
    return magic_map[constants.BATAVIA_MAGIC] < version.version_id(str)
}

version.later = function(str) {
    return magic_map[constants.BATAVIA_MAGIC] > version.version_id(str)
}

module.exports = version
