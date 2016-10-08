batavia.bitset = {};

(function() {

var BitSet = function(nbits) {
    this.bits = new Array(Math.floor((nbits + 7) / 8));
    this.len = nbits;
    for (var i = 0; i < this.bits.length; i++) {
        this.bits[i] = 0;
    }
};

var bit2byte = function(ibit) {
    return Math.floor(ibit / 8);
};

var bit2mask = function(ibit) {
    return 1 << (ibit & 0x7);
};

BitSet.prototype.testbit = function(ibit) {
    return this.bits[bit2byte(ibit)] & bit2mask(ibit) != 0;
};

/* Returns 0 if already set */
BitSet.prototype.addbit = function(ibit) {
    var b = bit2byte(ibit);
    var m = bit2mask(ibit);
    var byte = this.bits[b];
    var result = (byte & m) != 0;
    this.bits[b] |= m;
    return result;
};

BitSet.prototype.samebitset = function(bs2, nbits) {
    var bs1 = this;
};

BitSet.prototype.mergebitset = function(bs2, nbits) {
};

batavia.bitset.BitSet = BitSet;

})();
