var StackEntry = function() {
    this.s_state = 0;	/* State in current DFA */
  	this.s_dfa = null;		/* Current DFA */
  	this.s_parent = null;	/* Where to add next node */
};

var MAXSTACK = 1500;

var Stack = function() {
    this.s_top = MAXSTACK;		/* Top entry */
    this.s_base = new Array(MAXSTACK); /* Array of stack entries */
    this.reset();
};

Stack.prototype.reset = function() {
    this.s_top = MAXSTACK;
};

Stack.prototype.push = function(dfa, parent) {
    var top = null;
    if (this.s_top == 0) {
        console.log("s_push: parser stack overflow\n");
        return E_NOMEM;
    }
    top = --this.s_top;
    top.s_dfa = d;
    top.s_parent = parent;
    top.s_state = 0;
    return 0;
};

Stack.prototype.empty = function() {
    return this.s_top == MAXSTACK;
};

Stack.prototype.pop = function() {
    this.s_top++;
};

Stack.prototype.shift = function(type, str, newstate, lineno, col_offset) {
    var err;
    err = PyNode_AddChild(this.s_base[this.s_top].s_parent, type, str, lineno, col_offset);
    if (err) {
        return err;
    }
    this.s_base[this.s_top].s_state = newstate;
    return 0;
};


var Parser = function(g, start) {
  	this.p_stack = new Stack();	/* Stack of parser states */
  	this.p_grammar = g;	/* Grammar to use */
  	this.p_tree = new_node(start);	/* Top of parse tree */

    this.p_stack.push(PyGrammar_FindDFA(g, start), ps.p_tree);
};

Parser.prototype.add_token = function(type, str, lineno, col_offset, expected_ret) {
    var ps = this;
    var ilabel = 0;
    var err = 0;

    // D(printf("Token %s/'%s' ... ", _PyParser_TokenNames[type], str));

    /* Find out which label this token is */
    ilabel = ps.classify(type, str);
    if (ilabel < 0) {
        return E_SYNTAX;
    }

    /* Loop until the token is shifted or an error occurred */
    for (;;) {
        /* Fetch the current dfa and state */
        var d = ps.p_stack.s_base[s_top].s_dfa;
        var s = d.d_state[ps.p_stack.s_base[s_top].s_state];

        // D(printf(" DFA '%s', state %d:",
        //     d.d_name, ps.p_stack.s_base[s_top].s_state));

        /* Check accelerator */
        if (s.s_lower <= ilabel && ilabel < s.s_upper) {
            var x = s.s_accel[ilabel - s.s_lower];
            if (x != -1) {
                if (x & (1<<7)) {
                    /* Push non-terminal */
                    var nt = (x >> 8) + NT_OFFSET;
                    var arrow = x & ((1<<7)-1);
                    var d1 = PyGrammar_FindDFA(
                        ps.p_grammar, nt);
                    if ((err = ps.p_stack.push(nt, d1,
                        arrow, lineno, col_offset)) > 0) {
                        // D(printf(" MemError: push\n"));
                        return err;
                    }
                    // D(printf(" Push ...\n"));
                    continue;
                }

                /* Shift the token */
                if ((err = ps.p_stack.shift(type, str,
                                x, lineno, col_offset)) > 0) {
                    // D(printf(" MemError: shift.\n"));
                    return err;
                }
                // D(printf(" Shift.\n"));
                /* Pop while we are in an accept-only state */
                while (s = d.d_state
                                [ps.p_stack.s_base[s_top].s_state],
                    s.s_accept && s.s_narcs == 1) {
                    // D(printf("  DFA '%s', state %d: "
                    //          "Direct pop.\n",
                    //          d.d_name,
                    //          ps.p_stack.s_base[s_top].s_state));
                    ps.p_stack.pop();
                    if (ps.p_stack.empty()) {
                        // D(printf("  ACCEPT.\n"));
                        return E_DONE;
                    }
                    d = ps.p_stack.s_base[s_top].s_dfa;
                }
                return E_OK;
            }
        }

        if (s.s_accept) {
            /* Pop this dfa and try again */
            ps.p_stack.pop();
            // D(printf(" Pop ...\n"));
            if (ps.p_stack.empty()) {
                // D(printf(" Error: bottom of stack.\n"));
                return E_SYNTAX;
            }
            continue;
        }

        /* Stuck, report syntax error */
        // D(printf(" Error.\n"));
        if (expected_ret) {
            if (s.s_lower == s.s_upper - 1) {
                /* Only one possible expected token */
                expected_ret = ps.p_grammar.
                    g_ll.ll_label[s.s_lower].lb_type;
            }
            else
                expected_ret = -1;
        }
        return E_SYNTAX;
    }
};
