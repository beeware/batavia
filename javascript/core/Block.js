
export default class Block {
    constructor(type, handler, level) {

        this.type = type
        this.handler = handler
        this.level = level || 0
    }

    toString() {
        return '<Block (level ' + this.level + ')>'
    }
}
