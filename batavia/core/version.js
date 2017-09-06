var constants = require('./constants')

var version = {}

function VersionID(str) {
    var match = VersionID.pattern.exec(str)
    if (match === null) {
        // TODO throw
    }

    this.version = match[1].split('.').map(Number)
    while (this.version[this.version.length - 1] === 0) {
        this.version.pop()
    }
    this.pre = {}
    this.pre[match[4]] = Number(match[5])
    this.post = Number(match[7])
    this.dev = Number(match[9])
    this.val = [this.version, this.pre.a, this.pre.b, this.pre.rc, this.post, this.dev]
}
VersionID.pattern = /^(\d+(\.\d+)*)((a|b|rc)(\d+))?(\.post(\d+))?(\.dev(\d+))?$/

version.VersionID = VersionID

VersionID.prototype.toString = function() {
    var str = this.version.join('.')
    if (this.pre.a) {
        str += 'a' + this.pre.a
    }
    if (this.pre.b) {
        str += 'b' + this.pre.b
    }
    if (this.pre.rc) {
        str += 'rc' + this.pre.rc
    }
    if (this.dev) {
        str += '.dev' + this.dev
    }
    if (this.post) {
        str += '.post' + this.post
    }
    return 'Version identifier: ' + str
}

VersionID.prototype.earlier = function(other) {
    return this.val < other.val
}

VersionID.prototype.later = function(other) {
    return this.val > other.val
}

var magic_map = {}
magic_map[String.fromCharCode(238, 12, 13, 10)] = new VersionID('3.4')
magic_map[String.fromCharCode(248, 12, 13, 10)] = new VersionID('3.5a0')
magic_map[String.fromCharCode(22, 13, 13, 10)] = new VersionID('3.5')
magic_map[String.fromCharCode(23, 13, 13, 10)] = new VersionID('3.5.3')
magic_map[String.fromCharCode(51, 13, 13, 10)] = new VersionID('3.6.2')

version.earlier = function(str) {
    var current = magic_map[constants.BATAVIA_MAGIC]
    var other = new VersionID(str)
    return current.earlier(other)
}

version.later = function(str) {
    var current = magic_map[constants.BATAVIA_MAGIC]
    var other = new VersionID(str)
    return current.later(other)
}

module.exports = version
