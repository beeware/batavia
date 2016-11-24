var exceptions = require('../core').exceptions;
var types = require('../types');

var base64 = {
	__doc__: "",
	__file__: "batavia/modules/base64.js",
	__name__: "base64",
	__package__: ""
}

base64.b64encode = function(data) {
	var data_str = String.fromCharCode.apply(null, data.val)
	var encode = base64js.fromByteArray(data_str);
	var bytes = [];
	for (var i = 0; i < encode.length; i ++) {
		var code = encode.charCodeAt(i);
		bytes = bytes.concat([code]);
	};
	return new types.Bytes(bytes)
}
base64.b64encode.__doc__ = "Decode the Base64 encoded bytes-like object or ASCII string s.\n\nOptional altchars must be a bytes-like object or ASCII string of length 2\n    which specifies the alternative alphabet used instead of the '+' and '/'\n    characters.\n\n    The result is returned as a bytes object.  A binascii.Error is raised if\n    s is incorrectly padded.\n\n    If validate is False (the default), characters that are neither in the\n    normal base-64 alphabet nor the alternative alphabet are discarded prior\n    to the padding check.  If validate is True, these non-alphabet characters\n    in the input result in a binascii.Error.\n    "

base64.b64decode = function(data) {
	var data_str = String.fromCharCode.apply(null, data.val)
	if (data_str.length % 4 !== 0) {
		throw new exceptions.ValueError("Incorrect padding");
	}
	var encode = base64js.toByteArray(data_str);
	var bytes = [];
	for (var i = 0; i < encode.length; i ++) {
		var code = encode.charCodeAt(i);
		bytes = bytes.concat([code]);
	};
	return new types.Bytes(bytes);
}
base64.b64decode.__doc__ = "Encode the bytes-like object s using Base64 and return a bytes object.\n\n    Optional altchars should be a byte string of length 2 which specifies an\n    alternative alphabet for the '+' and '/' characters.  This allows an\n    application to e.g. generate url or filesystem safe Base64 strings.\n    "

base64._a85chars = function() {}
base64._a85chars2 = function() {}
base64._b32alphabet = function() {}
base64._b32rev = function() {}
base64._b32tab2 = function() {}
base64._b85alphabet = function() {}
base64._b85chars = function() {}
base64._b85chars2 = function() {}
base64._b85dec = function() {}
base64._bytes_from_decode_data = function() {}
base64._input_type_check = function() {}
base64._urlsafe_decode_translation = function() {}
base64._urlsafe_encode_translation = function() {}
base64.a85decode = function() {}
base64.a85encode = function() {}
base64.b16decode = function() {}
base64.b16encode = function() {}
base64.b32decode = function() {}
base64.b32encode = function() {}
base64.b85decode = function() {}
base64.b85encode = function() {}
base64.binascii = function() {}
base64.bytes_types = function() {}
base64.decode = function() {}
base64.decodebytes = function() {}

base64.decodestring = function(data) {
	return this.b64decode(data);
}

base64.encode = function() {}
base64.encodebytes = function() {}
base64.encodestring = function(data) {}
base64.main = function() {}
base64.re = function() {}
base64.standard_b64decode = function() {}
base64.standard_b64encode = function() {}
base64.struct = function() {}
base64.test = function() {}

base64.urlsafe_b64decode = function(data) {
	var data_str = String.fromCharCode.apply(null, data.val)
	var encode = base64js.toByteArray(data_str);
	var bytes = [];
	for (var i = 0; i < encode.length; i ++) {
		var code = encode.charCodeAt(i);
		bytes = bytes.concat([code]);
	};
	return new types.Bytes(bytes)
}

base64.urlsafe_b64encode = function(data) {
	var data_str = String.fromCharCode.apply(null, data.val)
	var encode = base64js.fromByteArray(data_str);
	var bytes = [];
	for (var i = 0; i < encode.length; i ++) {
		var code = encode.charCodeAt(i);
		bytes = bytes.concat([code]);
	};
	return new types.Bytes(bytes);
}

module.exports = base64;
