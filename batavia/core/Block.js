
module.exports = {
    'Block': function(type, handler, level) {
        this.type = type;
        this.handler = handler;
        this.level = level || 0;
    }
}

