
module.exports = {
    BigNumber: require('bignumber.js'),
    buffer: require('buffer'),
    // both base64 and ieee754 are dependencies of buffer,
    // but it's good to expose them as first-class vendored
    // libraries so they are usable all through batavia
    // as first-class vendored libs
    base64: require('base64-js'),
    ieee754: require('ieee754'),
    // lazy loading this module as it will break testing environment if loaded eagerly.
    moment: function() { if (moment == null) { return require('moment'); } return moment; }
>>>>>>> lazy load moment.js
}

