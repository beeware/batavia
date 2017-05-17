/**********************************************************************
 * Debugging helper
 **********************************************************************/

if (process.env.BATAVIA_DEBUG && process.env.BATAVIA_DEBUG !== '0') {
    // We are in debug mode! Log all the things!
    debug = console.log;
} else {
    // We are not in debug mode. Please be quiet!
    debug = function() {};
}

module.exports = debug
