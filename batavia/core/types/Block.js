
var Block = function(type, handler, level) {
    Object.call(this);
    this.type = type;
    this.handler = handler;
    this.level = level || 0;
}

Block.prototype.toString = function() {
    return '<Block (level ' + this.level + ')>';
}

module.exports = Block;