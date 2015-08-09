/*
 * opcode module - potentially shared between dis and other modules which
 * operate on bytecodes (e.g. peephole optimizers).
 */

var dis = {
    hasconst: new Set(),
    hasname: new Set(),
    hasjrel: new Set(),
    hasjabs: new Set(),
    haslocal: new Set(),
    hascompare: new Set(),
    hasfree: new Set(),
    hasnargs: new Set(),

    opmap: {},
    opname: [],

    unary_ops: new Set(),
    binary_ops: new Set(),
    inplace_ops: new Set(),
    slice_ops: new Set(),

    def_op: function(name, op) {
        dis.opname[op] = name;
        dis.opmap[name] = op;
    },

    name_op: function(name, op) {
        dis.def_op(name, op);
        dis.hasname.add(op);
    },

    jrel_op: function(name, op) {
        dis.def_op(name, op);
        dis.hasjrel.add(op);
    },

    jabs_op: function(name, op) {
        dis.def_op(name, op);
        dis.hasjabs.add(op);
    },
};

// Prime the opname list with all possible opnames
for (var op=0; op < 256; op++) {
    dis.opname.append('<' + op + '>');
}

// Register the known opnames
dis.def_op('POP_TOP', 1);
dis.def_op('ROT_TWO', 2);
dis.def_op('ROT_THREE', 3);
dis.def_op('DUP_TOP', 4);
dis.def_op('DUP_TOP_TWO', 5);

dis.def_op('NOP', 9);
dis.def_op('UNARY_POSITIVE', 10);
dis.def_op('UNARY_NEGATIVE', 11);
dis.def_op('UNARY_NOT', 12);

dis.def_op('UNARY_INVERT', 15);

dis.def_op('BINARY_POWER', 19);
dis.def_op('BINARY_MULTIPLY', 20);

dis.def_op('BINARY_MODULO', 22);
dis.def_op('BINARY_ADD', 23);
dis.def_op('BINARY_SUBTRACT', 24);
dis.def_op('BINARY_SUBSCR', 25);
dis.def_op('BINARY_FLOOR_DIVIDE', 26);
dis.def_op('BINARY_TRUE_DIVIDE', 27);
dis.def_op('INPLACE_FLOOR_DIVIDE', 28);
dis.def_op('INPLACE_TRUE_DIVIDE', 29);

dis.def_op('STORE_MAP', 54);
dis.def_op('INPLACE_ADD', 55);
dis.def_op('INPLACE_SUBTRACT', 56);
dis.def_op('INPLACE_MULTIPLY', 57);

dis.def_op('INPLACE_MODULO', 59);
dis.def_op('STORE_SUBSCR', 60);
dis.def_op('DELETE_SUBSCR', 61);
dis.def_op('BINARY_LSHIFT', 62);
dis.def_op('BINARY_RSHIFT', 63);
dis.def_op('BINARY_AND', 64);
dis.def_op('BINARY_XOR', 65);
dis.def_op('BINARY_OR', 66);
dis.def_op('INPLACE_POWER', 67);
dis.def_op('GET_ITER', 68);

dis.def_op('PRINT_EXPR', 70);
dis.def_op('LOAD_BUILD_CLASS', 71);
dis.def_op('YIELD_FROM', 72);

dis.def_op('INPLACE_LSHIFT', 75);
dis.def_op('INPLACE_RSHIFT', 76);
dis.def_op('INPLACE_AND', 77);
dis.def_op('INPLACE_XOR', 78);
dis.def_op('INPLACE_OR', 79);
dis.def_op('BREAK_LOOP', 80);
dis.def_op('WITH_CLEANUP', 81);

dis.def_op('RETURN_VALUE', 83);
dis.def_op('IMPORT_STAR', 84);

dis.def_op('YIELD_VALUE', 86);
dis.def_op('POP_BLOCK', 87);
dis.def_op('END_FINALLY', 88);
dis.def_op('POP_EXCEPT', 89);

dis.HAVE_ARGUMENT = 90;              // Opcodes from here have an argument:

dis.name_op('STORE_NAME', 90);       // Index in name list
dis.name_op('DELETE_NAME', 91);      // ""
dis.def_op('UNPACK_SEQUENCE', 92);   // Number of tuple items
dis.jrel_op('FOR_ITER', 93);
dis.def_op('UNPACK_EX', 94);
dis.name_op('STORE_ATTR', 95);       // Index in name list
dis.name_op('DELETE_ATTR', 96);      // ""
dis.name_op('STORE_GLOBAL', 97);     // ""
dis.name_op('DELETE_GLOBAL', 98);    // ""
dis.def_op('LOAD_CONST', 100);       // Index in const list
dis.hasconst.add(100);
dis.name_op('LOAD_NAME', 101);       // Index in name list
dis.def_op('BUILD_TUPLE', 102);      // Number of tuple items
dis.def_op('BUILD_LIST', 103);       // Number of list items
dis.def_op('BUILD_SET', 104);        // Number of set items
dis.def_op('BUILD_MAP', 105);        // Number of dict entries (upto 255)
dis.name_op('LOAD_ATTR', 106);       // Index in name list
dis.def_op('COMPARE_OP', 107);       // Comparison operator
dis.hascompare.add(107);
dis.name_op('IMPORT_NAME', 108);     // Index in name list
dis.name_op('IMPORT_FROM', 109);     // Index in name list

dis.jrel_op('JUMP_FORWARD', 110);    // Number of bytes to skip
dis.jabs_op('JUMP_IF_FALSE_OR_POP', 111); // Target byte offset from beginning of code
dis.jabs_op('JUMP_IF_TRUE_OR_POP', 112);  // ""
dis.jabs_op('JUMP_ABSOLUTE', 113);        // ""
dis.jabs_op('POP_JUMP_IF_FALSE', 114);    // ""
dis.jabs_op('POP_JUMP_IF_TRUE', 115);     // ""

dis.name_op('LOAD_GLOBAL', 116);     // Index in name list

dis.jabs_op('CONTINUE_LOOP', 119);   // Target address
dis.jrel_op('SETUP_LOOP', 120);      // Distance to target address
dis.jrel_op('SETUP_EXCEPT', 121);    // ""
dis.jrel_op('SETUP_FINALLY', 122);   // ""

dis.def_op('LOAD_FAST', 124);        // Local variable number
dis.haslocal.add(124);
dis.def_op('STORE_FAST', 125);       // Local variable number
dis.haslocal.add(125);
dis.def_op('DELETE_FAST', 126);      // Local variable number
dis.haslocal.add(126);

dis.def_op('RAISE_VARARGS', 130);    // Number of raise arguments (1, 2, or 3);
dis.def_op('CALL_FUNCTION', 131);    // #args + (#kwargs << 8);
dis.hasnargs.add(131);
dis.def_op('MAKE_FUNCTION', 132);    // Number of args with default values
dis.def_op('BUILD_SLICE', 133);      // Number of items
dis.def_op('MAKE_CLOSURE', 134);
dis.def_op('LOAD_CLOSURE', 135);
dis.hasfree.add(135);
dis.def_op('LOAD_DEREF', 136);
dis.hasfree.add(136);
dis.def_op('STORE_DEREF', 137);
dis.hasfree.add(137);
dis.def_op('DELETE_DEREF', 138);
dis.hasfree.add(138);

dis.def_op('CALL_FUNCTION_VAR', 140);     // #args + (#kwargs << 8);
dis.hasnargs.add(140);
dis.def_op('CALL_FUNCTION_KW', 141);      // #args + (#kwargs << 8);
dis.hasnargs.add(141);
dis.def_op('CALL_FUNCTION_VAR_KW', 142);  // #args + (#kwargs << 8);
dis.hasnargs.add(142);

dis.jrel_op('SETUP_WITH', 143);

dis.def_op('LIST_APPEND', 145);
dis.def_op('SET_ADD', 146);
dis.def_op('MAP_ADD', 147);

dis.def_op('LOAD_CLASSDEREF', 148);
dis.hasfree.add(148);

dis.def_op('EXTENDED_ARG', 144);
dis.EXTENDED_ARG = 144;
