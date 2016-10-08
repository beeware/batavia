var Label = function() {
    this.lb_type = 0;
    this.lb_str = '';
};

var EMPTY = 0;		/* Label number 0 is by definition the empty label */

/* An arc from one state to another */
var Arc = function() {
    this.a_lbl = 0; /* Label of this arc */
    this.a_arrow = 0;	/* State where this arc goes to */
};

/* A state in a DFA */

var State = function() {
    this.s_narcs = 0;
    this.s_arc = [];	/* Array of arcs */
    /* Optional accelerators */
    this.s_lower = 0;	/* Lowest label index */
    this.s_upper = 0;	/* Highest label index */
    this.s_accel = 0;	/* Accelerator */
    this.s_accept = 0;	/* Nonzero for accepting state */
};


var DFA = function() {
    this.d_type = 0;	/* Non-terminal this represents */
    this.d_name = '';	/* For printing */
    this.d_initial = 0;	/* Initial state */
    this.d_nstates = 0;
    this.d_state = [];	/* Array of states */
    this.d_first = null; // bitset
};


var Grammar = function() {
    this.g_ndfas = 0;
    this.g_dfa = [];		/* Array of DFAs */
    this.g_ll = 0;
    this.g_start = 0;	/* Start symbol of the grammar */
    this.g_accel = 0;	/* Set if accelerators present */
};
