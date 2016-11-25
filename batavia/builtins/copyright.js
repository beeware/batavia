var io = require('../core').io;

var copyright = function(args, kwargs) {
    io.stdout("Batavia: Copyright (c) 2015 Russell Keith-Magee. (BSD-3 Licence)\n"+
                "byterun: Copyright (c) 2013, Ned Batchelder. (MIT Licence)");
};
copyright.__doc__ = 'copyright()\n\ninteractive prompt objects for printing the license text, a list of\n    contributors and the copyright notice.';

module.exports = copyright;
