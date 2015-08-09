/*
 * A fake cell for closures.
 *
 * Closures keep names in scope by storing them not in a frame, but in a
 * separate object called a cell.  Frames share references to cells, and
 * the LOAD_DEREF and STORE_DEREF opcodes get and set the value from cells.
 *
 * This class acts as a cell, though it has to jump through two hoops to make
 * the simulation complete:
 *
 *     1. In order to create actual FunctionType functions, we have to have
 *        actual cell objects, which are difficult to make. See the twisty
 *        double-lambda in __init__.
 *
 *     2. Actual cell objects can't be modified, so to implement STORE_DEREF,
 *        we store a one-element list in our cell, and then use [0] as the
 *        actual value.
 */

batavia.core.Cell = function(value) {
    this.contents = value;
};

batavia.core.Cell.prototype.get = function() {
    return this.contents;
};

batavia.core.Cell.prototype.set = function(value) {
    this.contents = value;
};
