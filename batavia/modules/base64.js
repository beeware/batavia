batavia.modules.base64 = {
	__doc__: "",
	__name__: "base64",
	__file__: "base64.js",
	__package__: "",

	b64encode: function(data){
		var foo = batavia.types.Str(data).slice(2, -1)
		return "b'" + new batavia.types.Str(window.btoa(foo)) + "'";
	},

	b64decode: function(data){
		var foo = batavia.types.Str(data).slice(2, -1)
		return "b'" + new batavia.types.Str(window.atob(foo)) + "'";
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
	decodestring: function(){},
	encode: function(){},
	encodebytes: function(){},
	encodestring: function(){},
	main: function(){},
	re: function(){},
	standard_b64decode: function(){},
	standard_b64encode: function(){},
	struct: function(){},
	test: function(){},
	urlsafe_b64decode: function(){},
	urlsafe_b64encode: function(){},

};

batavia.modules.base64.b64encode.__doc__ = "Decode the Base64 encoded bytes-like object or ASCII string s.\n\nOptional altchars must be a bytes-like object or ASCII string of length 2\n    which specifies the alternative alphabet used instead of the '+' and '/'\n    characters.\n\n    The result is returned as a bytes object.  A binascii.Error is raised if\n    s is incorrectly padded.\n\n    If validate is False (the default), characters that are neither in the\n    normal base-64 alphabet nor the alternative alphabet are discarded prior\n    to the padding check.  If validate is True, these non-alphabet characters\n    in the input result in a binascii.Error.\n    "
batavia.modules.base64.b64decode.__doc__ = "Encode the bytes-like object s using Base64 and return a bytes object.\n\n    Optional altchars should be a byte string of length 2 which specifies an\n    alternative alphabet for the '+' and '/' characters.  This allows an\n    application to e.g. generate url or filesystem safe Base64 strings.\n    "
