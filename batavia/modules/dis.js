/*
 * opcode module - potentially shared between dis and other modules which
 * operate on bytecodes (e.g. peephole optimizers).
 */

batavia.modules.dis = {
    CO_GENERATOR: 32,  // flag for "this code uses yield"

    hasconst: new batavia.types.Set(),
    hasname: new batavia.types.Set(),
    hasjrel: new batavia.types.Set(),
    hasjabs: new batavia.types.Set(),
    haslocal: new batavia.types.Set(),
    hascompare: new batavia.types.Set(),
    hasfree: new batavia.types.Set(),
    hasnargs: new batavia.types.Set(),

    opmap: null,
    opname: [],

    unary_ops: new batavia.types.Set(),
    binary_ops: new batavia.types.Set(),
    inplace_ops: new batavia.types.Set(),
    // slice_ops: new batavia.types.Set(),

    def_op: function(name, op) {
        batavia.modules.dis.opname[op] = name;
        batavia.modules.dis.opmap[name] = op;
    },

    def_unary_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.unary_ops.add(new batavia.types.Int(op));
    },

    def_binary_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.binary_ops.add(new batavia.types.Int(op));
    },

    def_inplace_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.inplace_ops.add(new batavia.types.Int(op));
    },

    // def_slice_op: function(name, op) {
    //     batavia.modules.dis.def_op(name, op);
    //     batavia.modules.dis.slice_ops.add(op);
    // },

    name_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.hasname.add(new batavia.types.Int(op));
    },

    jrel_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.hasjrel.add(new batavia.types.Int(op));
    },

    jabs_op: function(name, op) {
        batavia.modules.dis.def_op(name, op);
        batavia.modules.dis.hasjabs.add(new batavia.types.Int(op));
    },

    init: function() {
        if (batavia.modules.dis.opmap !== null) {
            // Already initialized
            return;
        }

        batavia.modules.dis.opmap = {};

        // Prime the opname list with all possible opnames
        for (var op=0; op < 256; op++) {
            batavia.modules.dis.opname.push('<' + op + '>');
        }

        // Register the known opnames
        batavia.modules.dis.def_op('POP_TOP', 1);
        batavia.modules.dis.def_op('ROT_TWO', 2);
        batavia.modules.dis.def_op('ROT_THREE', 3);
        batavia.modules.dis.def_op('DUP_TOP', 4);
        batavia.modules.dis.def_op('DUP_TOP_TWO', 5);

        batavia.modules.dis.def_op('NOP', 9);
        batavia.modules.dis.NOP = 9;
        batavia.modules.dis.def_unary_op('UNARY_POSITIVE', 10);
        batavia.modules.dis.def_unary_op('UNARY_NEGATIVE', 11);
        batavia.modules.dis.def_unary_op('UNARY_NOT', 12);

        batavia.modules.dis.def_unary_op('UNARY_INVERT', 15);

        batavia.modules.dis.def_binary_op('BINARY_POWER', 19);
        batavia.modules.dis.def_binary_op('BINARY_MULTIPLY', 20);

        batavia.modules.dis.def_binary_op('BINARY_MODULO', 22);
        batavia.modules.dis.def_binary_op('BINARY_ADD', 23);
        batavia.modules.dis.def_binary_op('BINARY_SUBTRACT', 24);
        batavia.modules.dis.def_binary_op('BINARY_SUBSCR', 25);
        batavia.modules.dis.def_binary_op('BINARY_FLOOR_DIVIDE', 26);
        batavia.modules.dis.def_binary_op('BINARY_TRUE_DIVIDE', 27);
        batavia.modules.dis.def_inplace_op('INPLACE_FLOOR_DIVIDE', 28);
        batavia.modules.dis.def_inplace_op('INPLACE_TRUE_DIVIDE', 29);

        batavia.modules.dis.def_op('STORE_MAP', 54);
        batavia.modules.dis.def_inplace_op('INPLACE_ADD', 55);
        batavia.modules.dis.def_inplace_op('INPLACE_SUBTRACT', 56);
        batavia.modules.dis.def_inplace_op('INPLACE_MULTIPLY', 57);

        batavia.modules.dis.def_inplace_op('INPLACE_MODULO', 59);
        batavia.modules.dis.def_op('STORE_SUBSCR', 60);
        batavia.modules.dis.def_op('DELETE_SUBSCR', 61);
        batavia.modules.dis.def_binary_op('BINARY_LSHIFT', 62);
        batavia.modules.dis.def_binary_op('BINARY_RSHIFT', 63);
        batavia.modules.dis.def_binary_op('BINARY_AND', 64);
        batavia.modules.dis.def_binary_op('BINARY_XOR', 65);
        batavia.modules.dis.def_binary_op('BINARY_OR', 66);
        batavia.modules.dis.def_inplace_op('INPLACE_POWER', 67);
        batavia.modules.dis.def_op('GET_ITER', 68);

        batavia.modules.dis.def_op('PRINT_EXPR', 70);
        batavia.modules.dis.def_op('LOAD_BUILD_CLASS', 71);
        batavia.modules.dis.def_op('YIELD_FROM', 72);

        batavia.modules.dis.def_inplace_op('INPLACE_LSHIFT', 75);
        batavia.modules.dis.def_inplace_op('INPLACE_RSHIFT', 76);
        batavia.modules.dis.def_inplace_op('INPLACE_AND', 77);
        batavia.modules.dis.def_inplace_op('INPLACE_XOR', 78);
        batavia.modules.dis.def_inplace_op('INPLACE_OR', 79);
        batavia.modules.dis.def_op('BREAK_LOOP', 80);
        batavia.modules.dis.def_op('WITH_CLEANUP', 81);

        batavia.modules.dis.def_op('RETURN_VALUE', 83);
        batavia.modules.dis.def_op('IMPORT_STAR', 84);

        batavia.modules.dis.def_op('YIELD_VALUE', 86);
        batavia.modules.dis.def_op('POP_BLOCK', 87);
        batavia.modules.dis.def_op('END_FINALLY', 88);
        batavia.modules.dis.def_op('POP_EXCEPT', 89);

        batavia.modules.dis.HAVE_ARGUMENT = 90;              // Opcodes from here have an argument:

        batavia.modules.dis.name_op('STORE_NAME', 90);       // Index in name list
        batavia.modules.dis.name_op('DELETE_NAME', 91);      // ""
        batavia.modules.dis.def_op('UNPACK_SEQUENCE', 92);   // Number of tuple items
        batavia.modules.dis.jrel_op('FOR_ITER', 93);
        batavia.modules.dis.def_op('UNPACK_EX', 94);
        batavia.modules.dis.name_op('STORE_ATTR', 95);       // Index in name list
        batavia.modules.dis.name_op('DELETE_ATTR', 96);      // ""
        batavia.modules.dis.name_op('STORE_GLOBAL', 97);     // ""
        batavia.modules.dis.name_op('DELETE_GLOBAL', 98);    // ""
        batavia.modules.dis.def_op('LOAD_CONST', 100);       // Index in const list
        batavia.modules.dis.hasconst.add(new batavia.types.Int(100));
        batavia.modules.dis.name_op('LOAD_NAME', 101);       // Index in name list
        batavia.modules.dis.def_op('BUILD_TUPLE', 102);      // Number of tuple items
        batavia.modules.dis.def_op('BUILD_LIST', 103);       // Number of list items
        batavia.modules.dis.def_op('BUILD_SET', 104);        // Number of set items
        batavia.modules.dis.def_op('BUILD_MAP', 105);        // Number of dict entries (upto 255)
        batavia.modules.dis.name_op('LOAD_ATTR', 106);       // Index in name list
        batavia.modules.dis.def_op('COMPARE_OP', 107);       // Comparison operator
        batavia.modules.dis.hascompare.add(new batavia.types.Int(107));
        batavia.modules.dis.name_op('IMPORT_NAME', 108);     // Index in name list
        batavia.modules.dis.name_op('IMPORT_FROM', 109);     // Index in name list

        batavia.modules.dis.jrel_op('JUMP_FORWARD', 110);    // Number of bytes to skip
        batavia.modules.dis.jabs_op('JUMP_IF_FALSE_OR_POP', 111); // Target byte offset from beginning of code
        batavia.modules.dis.jabs_op('JUMP_IF_TRUE_OR_POP', 112);  // ""
        batavia.modules.dis.jabs_op('JUMP_ABSOLUTE', 113);        // ""
        batavia.modules.dis.jabs_op('POP_JUMP_IF_FALSE', 114);    // ""
        batavia.modules.dis.jabs_op('POP_JUMP_IF_TRUE', 115);     // ""

        batavia.modules.dis.name_op('LOAD_GLOBAL', 116);     // Index in name list

        batavia.modules.dis.jabs_op('CONTINUE_LOOP', 119);   // Target address
        batavia.modules.dis.jrel_op('SETUP_LOOP', 120);      // Distance to target address
        batavia.modules.dis.jrel_op('SETUP_EXCEPT', 121);    // ""
        batavia.modules.dis.jrel_op('SETUP_FINALLY', 122);   // ""

        batavia.modules.dis.def_op('LOAD_FAST', 124);        // Local variable number
        batavia.modules.dis.haslocal.add(new batavia.types.Int(124));
        batavia.modules.dis.def_op('STORE_FAST', 125);       // Local variable number
        batavia.modules.dis.haslocal.add(new batavia.types.Int(125));
        batavia.modules.dis.def_op('DELETE_FAST', 126);      // Local variable number
        batavia.modules.dis.haslocal.add(new batavia.types.Int(126));

        batavia.modules.dis.def_op('RAISE_VARARGS', 130);    // Number of raise arguments (1, 2, or 3);
        batavia.modules.dis.def_op('CALL_FUNCTION', 131);    // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(new batavia.types.Int(131));
        batavia.modules.dis.def_op('MAKE_FUNCTION', 132);    // Number of args with default values
        batavia.modules.dis.def_op('BUILD_SLICE', 133);      // Number of items
        batavia.modules.dis.def_op('MAKE_CLOSURE', 134);
        batavia.modules.dis.def_op('LOAD_CLOSURE', 135);
        batavia.modules.dis.hasfree.add(new batavia.types.Int(135));
        batavia.modules.dis.def_op('LOAD_DEREF', 136);
        batavia.modules.dis.hasfree.add(new batavia.types.Int(136));
        batavia.modules.dis.def_op('STORE_DEREF', 137);
        batavia.modules.dis.hasfree.add(new batavia.types.Int(137));
        batavia.modules.dis.def_op('DELETE_DEREF', 138);
        batavia.modules.dis.hasfree.add(new batavia.types.Int(138));

        batavia.modules.dis.def_op('CALL_FUNCTION_VAR', 140);     // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(new batavia.types.Int(140));
        batavia.modules.dis.def_op('CALL_FUNCTION_KW', 141);      // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(new batavia.types.Int(141));
        batavia.modules.dis.def_op('CALL_FUNCTION_VAR_KW', 142);  // #args + (#kwargs << 8);
        batavia.modules.dis.hasnargs.add(new batavia.types.Int(142));

        batavia.modules.dis.jrel_op('SETUP_WITH', 143);

        batavia.modules.dis.def_op('LIST_APPEND', 145);
        batavia.modules.dis.def_op('SET_ADD', 146);
        batavia.modules.dis.def_op('MAP_ADD', 147);

        batavia.modules.dis.def_op('LOAD_CLASSDEREF', 148);
        batavia.modules.dis.hasfree.add(new batavia.types.Int(148));

        batavia.modules.dis.def_op('EXTENDED_ARG', 144);
        batavia.modules.dis.EXTENDED_ARG = 144;
    }
};
