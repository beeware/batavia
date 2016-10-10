var Label = function(type, str) {
    this.lb_type = type;
    this.lb_str = str;
};

var EMPTY = 0;		/* Label number 0 is by definition the empty label */

/* An arc from one state to another */
var Arc = function(label, arrow) {
    if (label == "EMPTY") {
        label = EMPTY;
    }
    this.a_lbl = label; /* Label of this arc */
    this.a_arrow = arrow;	/* State where this arc goes to */
};

/* A state in a DFA */

var State = function(arcs) {
    this.s_arc = arcs;	/* Array of arcs */
    /* Optional accelerators */
    this.s_lower = 0;	/* Lowest label index */
    this.s_upper = 0;	/* Highest label index */
    this.s_accel = 0;	/* Accelerator */
    this.s_accept = 0;	/* Nonzero for accepting state */
};


var DFA = function(type, name, initial, states, first) {
    this.d_type = type;	/* Non-terminal this represents */
    this.d_name = name;	/* For printing */
    this.d_initial = initial;	/* Initial state */
    this.d_state = states;	/* Array of states */
    this.d_first = first; // bitset
};


var Grammar = function(dfas, labels) {
    this.g_dfa = dfas;		/* Array of DFAs */
    this.g_ll = labels;
};
