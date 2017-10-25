/*
 * opcode module - potentially shared between dis and other modules which
 * operate on bytecodes (e.g. peephole optimizers).
 */

var dis = {
    CO_GENERATOR: 32,  // flag for "this code uses yield"

    hasconst: {},
    hasname: {},
    hasjrel: {},
    hasjabs: {},
    haslocal: {},
    hascompare: {},
    hasfree: {},
    hasnargs: {},

    opmap: {},
    opname: [],

    unary_ops: {},
    binary_ops: {},
    inplace_ops: {}
    // slice_ops: {},
}

function def_op(name, op) {
    dis.opname[op] = name
    dis.opmap[name] = op
}

function def_unary_op(name, op) {
    def_op(name, op)
    dis.unary_ops[op] = op
}

function def_binary_op(name, op) {
    def_op(name, op)
    dis.binary_ops[op] = op
}

function def_inplace_op(name, op) {
    def_op(name, op)
    dis.inplace_ops[op] = op
}

// function def_slice_op(name, op) {
//     def_op(name, op);
//     slice_ops[op] = op;
// }

function name_op(name, op) {
    def_op(name, op)
    dis.hasname[op] = op
}

function jrel_op(name, op) {
    def_op(name, op)
    dis.hasjrel[op] = op
}

function jabs_op(name, op) {
    def_op(name, op)
    dis.hasjabs[op] = op
}

// Prime the opname list with all possible opnames
for (var op = 0; op < 256; op++) {
    dis.opname.push('<' + op + '>')
}

// Register the known opnames
def_op('POP_TOP', 1)
def_op('ROT_TWO', 2)
def_op('ROT_THREE', 3)
def_op('DUP_TOP', 4)
def_op('DUP_TOP_TWO', 5)

def_op('NOP', 9)
dis.NOP = 9 // TODO why does this require special handling?
def_unary_op('UNARY_POSITIVE', 10)
def_unary_op('UNARY_NEGATIVE', 11)
def_unary_op('UNARY_NOT', 12)

def_unary_op('UNARY_INVERT', 15)

def_binary_op('BINARY_POWER', 19)
def_binary_op('BINARY_MULTIPLY', 20)

def_binary_op('BINARY_MODULO', 22)
def_binary_op('BINARY_ADD', 23)
def_binary_op('BINARY_SUBTRACT', 24)
def_binary_op('BINARY_SUBSCR', 25)
def_binary_op('BINARY_FLOOR_DIVIDE', 26)
def_binary_op('BINARY_TRUE_DIVIDE', 27)
def_inplace_op('INPLACE_FLOOR_DIVIDE', 28)
def_inplace_op('INPLACE_TRUE_DIVIDE', 29)

def_op('STORE_MAP', 54)
def_inplace_op('INPLACE_ADD', 55)
def_inplace_op('INPLACE_SUBTRACT', 56)
def_inplace_op('INPLACE_MULTIPLY', 57)

def_inplace_op('INPLACE_MODULO', 59)
def_op('STORE_SUBSCR', 60)
def_op('DELETE_SUBSCR', 61)
def_binary_op('BINARY_LSHIFT', 62)
def_binary_op('BINARY_RSHIFT', 63)
def_binary_op('BINARY_AND', 64)
def_binary_op('BINARY_XOR', 65)
def_binary_op('BINARY_OR', 66)
def_inplace_op('INPLACE_POWER', 67)
def_op('GET_ITER', 68)

// Introduced in Python 3.5
def_op('GET_YIELD_FROM_ITER', 69)

def_op('PRINT_EXPR', 70)
def_op('LOAD_BUILD_CLASS', 71)
def_op('YIELD_FROM', 72)

def_inplace_op('INPLACE_LSHIFT', 75)
def_inplace_op('INPLACE_RSHIFT', 76)
def_inplace_op('INPLACE_AND', 77)
def_inplace_op('INPLACE_XOR', 78)
def_inplace_op('INPLACE_OR', 79)
def_op('BREAK_LOOP', 80)
def_op('WITH_CLEANUP', 81)

// Introduced in Python 3.5
def_op('WITH_CLEANUP_FINISH', 82)

def_op('RETURN_VALUE', 83)
def_op('IMPORT_STAR', 84)

def_op('YIELD_VALUE', 86)
def_op('POP_BLOCK', 87)
def_op('END_FINALLY', 88)
def_op('POP_EXCEPT', 89)

dis.HAVE_ARGUMENT = 90          // Opcodes from here have an argument:

name_op('STORE_NAME', 90)       // Index in name list
name_op('DELETE_NAME', 91)      // ""
def_op('UNPACK_SEQUENCE', 92)   // Number of tuple items
jrel_op('FOR_ITER', 93)
def_op('UNPACK_EX', 94)
name_op('STORE_ATTR', 95)       // Index in name list
name_op('DELETE_ATTR', 96)      // ""
name_op('STORE_GLOBAL', 97)     // ""
name_op('DELETE_GLOBAL', 98)    // ""
def_op('LOAD_CONST', 100)       // Index in const list
dis.hasconst[100] = 100
name_op('LOAD_NAME', 101)       // Index in name list
def_op('BUILD_TUPLE', 102)      // Number of tuple items
def_op('BUILD_LIST', 103)       // Number of list items
def_op('BUILD_SET', 104)        // Number of set items
def_op('BUILD_MAP', 105)        // Number of dict entries (upto 255)
name_op('LOAD_ATTR', 106)       // Index in name list
def_op('COMPARE_OP', 107)       // Comparison operator
dis.hascompare[107] = 107
name_op('IMPORT_NAME', 108)     // Index in name list
name_op('IMPORT_FROM', 109)     // Index in name list

jrel_op('JUMP_FORWARD', 110)    // Number of bytes to skip
jabs_op('JUMP_IF_FALSE_OR_POP', 111) // Target byte offset from beginning of code
jabs_op('JUMP_IF_TRUE_OR_POP', 112)  // ""
jabs_op('JUMP_ABSOLUTE', 113)        // ""
jabs_op('POP_JUMP_IF_FALSE', 114)    // ""
jabs_op('POP_JUMP_IF_TRUE', 115)     // ""

name_op('LOAD_GLOBAL', 116)     // Index in name list

jabs_op('CONTINUE_LOOP', 119)   // Target address
jrel_op('SETUP_LOOP', 120)      // Distance to target address
jrel_op('SETUP_EXCEPT', 121)    // ""
jrel_op('SETUP_FINALLY', 122)   // ""

def_op('LOAD_FAST', 124)        // Local variable number
dis.haslocal[124] = 124
def_op('STORE_FAST', 125)       // Local variable number
dis.haslocal[125] = 125
def_op('DELETE_FAST', 126)      // Local variable number
dis.haslocal[126] = 126

def_op('RAISE_VARARGS', 130)    // Number of raise arguments (1, 2, or 3);
def_op('CALL_FUNCTION', 131)    // #args + (#kwargs << 8);
dis.hasnargs[131] = 131
def_op('MAKE_FUNCTION', 132)    // Number of args with default values
def_op('BUILD_SLICE', 133)      // Number of items
def_op('MAKE_CLOSURE', 134)
def_op('LOAD_CLOSURE', 135)
dis.hasfree[135] = 135
def_op('LOAD_DEREF', 136)
dis.hasfree[136] = 136
def_op('STORE_DEREF', 137)
dis.hasfree[137] = 137
def_op('DELETE_DEREF', 138)
dis.hasfree[138] = 138

def_op('CALL_FUNCTION_VAR', 140)     // #args + (#kwargs << 8);
dis.hasnargs[140] = 140
def_op('CALL_FUNCTION_KW', 141)      // #args + (#kwargs << 8);
dis.hasnargs[141] = 141
def_op('CALL_FUNCTION_VAR_KW', 142)  // #args + (#kwargs << 8);
dis.hasnargs[142] = 142

jrel_op('SETUP_WITH', 143)

def_op('LIST_APPEND', 145)
def_op('SET_ADD', 146)
def_op('MAP_ADD', 147)

def_op('LOAD_CLASSDEREF', 148)
dis.hasfree[148] = 148

def_op('EXTENDED_ARG', 144)
dis.EXTENDED_ARG = 144

// Introduced in Python 3.6
def_op('BUILD_CONST_KEY_MAP', 156)

module.exports = dis
