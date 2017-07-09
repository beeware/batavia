/**********************************************************************
 * Debugging helper
 **********************************************************************/
module.exports = function(debug) {
    if (debug) {
        module.debug = console.log
    } else {
        module.debug = function() {}
    }

    return module
}
