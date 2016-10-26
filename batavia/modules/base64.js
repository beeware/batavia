batavia.modules.base64 = {
	__doc__: "",
	__name__: "base64",
	__file__: "base64.js",
	__package__: "",

	b64encode: function(data, altchars){
		altchars = altchars || 0;
		if (altchars !== 0) {
			altchars = String.fromCharCode.apply(null, altchars.val)
		};
		var data_str = String.fromCharCode.apply(null, data.val);
		var encode = window.btoa(data_str);
		if (altchars === 0) {
		} else if (altchars.length === 2) {
			encode = encode.replace(/[+]/, altchars[0]);
			encode = encode.replace(/[/]/, altchars[1]);
		} else {
			throw new batavia.builtins.ValueError("Incorrect value for altchars");
		}
		var bytes = [];
		for (var i = 0; i < encode.length; i ++) {
			var code = encode.charCodeAt(i);
			bytes = bytes.concat([code]);
		};
		return new batavia.types.Bytes(bytes)
	},

	b64decode: function(data, altchars, validate) {
		altchars = altchars || 0;
		validate = validate && true;
		var data_str = String.fromCharCode.apply(null, data.val)
		var encode = window.atob(data_str);
		if (altchars !== 0) {
			altchars = String.fromCharCode.apply(null, altchars.val)
		};
		if (altchars === 0) {
		} else if (altchars.length === 2) {
			encode = encode.replace(/altchars[0]/, '+');
			encode = encode.replace(/altchars[1]/, '/');
		} else {
			throw new batavia.builtins.ValueError("Incorrect value for altchars")
		}
		if (validate && !/[a-zA-Z0-9+/]*={0,2}$/.exec(encode)) {
			throw new batavia.builtins.ValueError("Non-base64 digit found")}
		if (data_str.length % 4 !== 0){
			throw new batavia.builtins.ValueError("Incorrect padding");
		}
		var bytes = [];
		for (var i = 0; i < encode.length; i ++) {
			var code = encode.charCodeAt(i);
			bytes = bytes.concat([code]);
		};
		return new batavia.types.Bytes(bytes);
	},

	_a85chars: function(){},
	_a85chars2: function(){},
	_b32alphabet: function(){},
	_b32rev: function(){},
	_b32tab2: function(){},
	_b85alphabet: function(){},
	_b85chars: function(){},
	_b85chars2: function(){},
	_b85dec: function(){},
	_bytes_from_decode_data: function(){},
	_input_type_check: function(){},
	_urlsafe_decode_translation: function(){},
	_urlsafe_encode_translation: function(){},
	a85decode: function(){},
	a85encode: function(){},
	b16decode: function(){},
	b16encode: function(){},
	b32decode: function(){},
	b32encode: function(){},
	b85decode: function(){},
	b85encode: function(){},
	binascii: function(){},
	bytes_types: function(){},
	decode: function(){},
	decodebytes: function(){},
	decodestring: function(data){
		return this.b64decode(data);
	},
	encode: function(){},
	encodebytes: function(){},
	encodestring: function(data){},
	main: function(){},
	re: function(){},
	standard_b64decode: function(data){
		return this.b64decode(data);
	},
	standard_b64encode: function(data){
		return this.b64encode(data);
	},
	struct: function(){},
	test: function(){},
	urlsafe_b64decode: function(data){
		var data_str = String.fromCharCode.apply(null, data.val)
		var encode = window.atob(data_str);
		encode = encode.replace(/[-]/, '+');
		encode = encode.replace(/[_]/, '/');
		var bytes = [];
		for (var i = 0; i < encode.length; i ++) {
			var code = encode.charCodeAt(i);
			bytes = bytes.concat([code]);
		};
		return new batavia.types.Bytes(bytes)
	},
	urlsafe_b64encode: function(data){
		var data_str = String.fromCharCode.apply(null, data.val)
		var encode = window.btoa(data_str);
		encode = encode.replace(/[+]/, '-');
		encode = encode.replace(/[/]/, '_');
		var bytes = [];
		for (var i = 0; i < encode.length; i ++) {
			var code = encode.charCodeAt(i);
			bytes = bytes.concat([code]);
		};
		return new batavia.types.Bytes(bytes);
	},
};

batavia.modules.base64.b64encode.__doc__ = "Decode the Base64 encoded bytes-like object or ASCII string s.\n\nOptional altchars must be a bytes-like object or ASCII string of length 2\n    which specifies the alternative alphabet used instead of the '+' and '/'\n    characters.\n\n    The result is returned as a bytes object.  A binascii.Error is raised if\n    s is incorrectly padded.\n\n    If validate is False (the default), characters that are neither in the\n    normal base-64 alphabet nor the alternative alphabet are discarded prior\n    to the padding check.  If validate is True, these non-alphabet characters\n    in the input result in a binascii.Error.\n    "
batavia.modules.base64.b64decode.__doc__ = "Encode the bytes-like object s using Base64 and return a bytes object.\n\n    Optional altchars should be a byte string of length 2 which specifies an\n    alternative alphabet for the '+' and '/' characters.  This allows an\n    application to e.g. generate url or filesystem safe Base64 strings.\n    "
