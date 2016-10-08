from ..utils import TranspileTestCase

import unittest

def assertTokenizaton(self, source, expected):
    self.assertJavaScriptExecution("""
        import _compile
        s = %s
        tok = _compile.Tokenizer(s)
        for i in range(10000):
            t = tok.get_token()
            if t is None:
                break
            token, a, b = str(t).split(",")
            print(i, token, s[int(a):int(b)])
        """ % repr(source), expected)

class CompileTests(TranspileTestCase):

    def test_compile(self):
        self.assertJavaScriptExecution("""
            src = 'x = 1'
            print(compile(src, 'testing.py', 'single', 0))
            """, "")

    def test_basic_tokenize(self):
        assertTokenizaton(self, "x = 1; fun.w3 -= 14.0e4j",
            """
0 NAME x
1 EQUAL =
2 NUMBER 1
3 SEMI ;
4 NAME fun
5 DOT .
6 NAME w3
7 MINEQUAL -=
8 NUMBER 14.0e4j
""")

    def test_multiline_tokenize(self):
        assertTokenizaton(self, '''
LOOPS = 50000

from time import clock

__version__ = "1.2"

[Ident1, Ident2, Ident3, Ident4, Ident5] = range(1, 6)
''',
        """
        0 NEWLINE
        1 NAME LOOPS
        2 EQUAL =
        3 NUMBER 50000
        4 NEWLINE
        5 NEWLINE
        6 NAME from
        7 NAME time
        8 NAME import
        9 NAME clock
        10 NEWLINE
        11 NEWLINE
        12 NAME __version__
        13 EQUAL =
        14 STRING "1.2"
        15 NEWLINE
        16 NEWLINE
        17 LSQB [
        18 NAME Ident1
        19 COMMA ,
        20 NAME Ident2
        21 COMMA ,
        22 NAME Ident3
        23 COMMA ,
        24 NAME Ident4
        25 COMMA ,
        26 NAME Ident5
        27 RSQB ]
        28 EQUAL =
        29 NAME range
        30 LPAR (
        31 NUMBER 1
        32 COMMA ,
        33 NUMBER 6
        34 RPAR )
        """)

    def test_pystone_tokenize(self):
        assertTokenizaton(self, '''
LOOPS = 50000

from time import clock

__version__ = "1.2"

[Ident1, Ident2, Ident3, Ident4, Ident5] = range(1, 6)

class Record:

    def __init__(self, PtrComp = None, Discr = 0, EnumComp = 0,
                       IntComp = 0, StringComp = 0):
        self.PtrComp = PtrComp
        self.Discr = Discr
        self.EnumComp = EnumComp
        self.IntComp = IntComp
        self.StringComp = StringComp

    def copy(self):
        return Record(self.PtrComp, self.Discr, self.EnumComp,
                      self.IntComp, self.StringComp)

TRUE = 1
FALSE = 0

def main(loops=LOOPS):
    benchtime, stones = pystones(loops)
    print("Pystone(%s) time for %d passes = %g" % \\
          (__version__, loops, benchtime))
    print("This machine benchmarks at %g pystones/second" % stones)


def pystones(loops=LOOPS):
    return Proc0(loops)

IntGlob = 0
BoolGlob = FALSE
Char1Glob = '\\0'
Char2Glob = '\\0'
Array1Glob = [0]*51
Array2Glob = [x[:] for x in [Array1Glob]*51]
PtrGlb = None
PtrGlbNext = None

def Proc0(loops=LOOPS):
    global IntGlob
    global BoolGlob
    global Char1Glob
    global Char2Glob
    global Array1Glob
    global Array2Glob
    global PtrGlb
    global PtrGlbNext

    starttime = clock()
    for i in range(loops):
        pass
    nulltime = clock() - starttime

    PtrGlbNext = Record()
    PtrGlb = Record()
    PtrGlb.PtrComp = PtrGlbNext
    PtrGlb.Discr = Ident1
    PtrGlb.EnumComp = Ident3
    PtrGlb.IntComp = 40
    PtrGlb.StringComp = "DHRYSTONE PROGRAM, SOME STRING"
    String1Loc = "DHRYSTONE PROGRAM, 1'ST STRING"
    Array2Glob[8][7] = 10

    starttime = clock()

    for i in range(loops):
        Proc5()
        Proc4()
        IntLoc1 = 2
        IntLoc2 = 3
        String2Loc = "DHRYSTONE PROGRAM, 2'ND STRING"
        EnumLoc = Ident2
        BoolGlob = not Func2(String1Loc, String2Loc)
        while IntLoc1 < IntLoc2:
            IntLoc3 = 5 * IntLoc1 - IntLoc2
            IntLoc3 = Proc7(IntLoc1, IntLoc2)
            IntLoc1 = IntLoc1 + 1
        Proc8(Array1Glob, Array2Glob, IntLoc1, IntLoc3)
        PtrGlb = Proc1(PtrGlb)
        CharIndex = 'A'
        while CharIndex <= Char2Glob:
            if EnumLoc == Func1(CharIndex, 'C'):
                EnumLoc = Proc6(Ident1)
            CharIndex = chr(ord(CharIndex)+1)
        IntLoc3 = IntLoc2 * IntLoc1
        IntLoc2 = IntLoc3 // IntLoc1
        IntLoc2 = 7 * (IntLoc3 - IntLoc2) - IntLoc1
        IntLoc1 = Proc2(IntLoc1)

    benchtime = clock() - starttime - nulltime
    if benchtime == 0.0:
        loopsPerBenchtime = 0.0
    else:
        loopsPerBenchtime = (loops / benchtime)
    return benchtime, loopsPerBenchtime

def Proc1(PtrParIn):
    PtrParIn.PtrComp = NextRecord = PtrGlb.copy()
    PtrParIn.IntComp = 5
    NextRecord.IntComp = PtrParIn.IntComp
    NextRecord.PtrComp = PtrParIn.PtrComp
    NextRecord.PtrComp = Proc3(NextRecord.PtrComp)
    if NextRecord.Discr == Ident1:
        NextRecord.IntComp = 6
        NextRecord.EnumComp = Proc6(PtrParIn.EnumComp)
        NextRecord.PtrComp = PtrGlb.PtrComp
        NextRecord.IntComp = Proc7(NextRecord.IntComp, 10)
    else:
        PtrParIn = NextRecord.copy()
    NextRecord.PtrComp = None
    return PtrParIn

def Proc2(IntParIO):
    IntLoc = IntParIO + 10
    while 1:
        if Char1Glob == 'A':
            IntLoc = IntLoc - 1
            IntParIO = IntLoc - IntGlob
            EnumLoc = Ident1
        if EnumLoc == Ident1:
            break
    return IntParIO

def Proc3(PtrParOut):
    global IntGlob

    if PtrGlb is not None:
        PtrParOut = PtrGlb.PtrComp
    else:
        IntGlob = 100
    PtrGlb.IntComp = Proc7(10, IntGlob)
    return PtrParOut

def Proc4():
    global Char2Glob

    BoolLoc = Char1Glob == 'A'
    BoolLoc = BoolLoc or BoolGlob
    Char2Glob = 'B'

def Proc5():
    global Char1Glob
    global BoolGlob

    Char1Glob = 'A'
    BoolGlob = FALSE

def Proc6(EnumParIn):
    EnumParOut = EnumParIn
    if not Func3(EnumParIn):
        EnumParOut = Ident4
    if EnumParIn == Ident1:
        EnumParOut = Ident1
    elif EnumParIn == Ident2:
        if IntGlob > 100:
            EnumParOut = Ident1
        else:
            EnumParOut = Ident4
    elif EnumParIn == Ident3:
        EnumParOut = Ident2
    elif EnumParIn == Ident4:
        pass
    elif EnumParIn == Ident5:
        EnumParOut = Ident3
    return EnumParOut

def Proc7(IntParI1, IntParI2):
    IntLoc = IntParI1 + 2
    IntParOut = IntParI2 + IntLoc
    return IntParOut

def Proc8(Array1Par, Array2Par, IntParI1, IntParI2):
    global IntGlob

    IntLoc = IntParI1 + 5
    Array1Par[IntLoc] = IntParI2
    Array1Par[IntLoc+1] = Array1Par[IntLoc]
    Array1Par[IntLoc+30] = IntLoc
    for IntIndex in range(IntLoc, IntLoc+2):
        Array2Par[IntLoc][IntIndex] = IntLoc
    Array2Par[IntLoc][IntLoc-1] = Array2Par[IntLoc][IntLoc-1] + 1
    Array2Par[IntLoc+20][IntLoc] = Array1Par[IntLoc]
    IntGlob = 5

def Func1(CharPar1, CharPar2):
    CharLoc1 = CharPar1
    CharLoc2 = CharLoc1
    if CharLoc2 != CharPar2:
        return Ident1
    else:
        return Ident2

def Func2(StrParI1, StrParI2):
    IntLoc = 1
    while IntLoc <= 1:
        if Func1(StrParI1[IntLoc], StrParI2[IntLoc+1]) == Ident1:
            CharLoc = 'A'
            IntLoc = IntLoc + 1
    if CharLoc >= 'W' and CharLoc <= 'Z':
        IntLoc = 7
    if CharLoc == 'X':
        return TRUE
    else:
        if StrParI1 > StrParI2:
            IntLoc = IntLoc + 7
            return TRUE
        else:
            return FALSE

def Func3(EnumParIn):
    EnumLoc = EnumParIn
    if EnumLoc == Ident3: return TRUE
    return FALSE

if __name__ == '__main__':
    import sys
    def error(msg):
        print(msg, end=' ', file=sys.stderr)
        print("usage: %s [number_of_loops]" % sys.argv[0], file=sys.stderr)
        sys.exit(100)
    nargs = len(sys.argv) - 1
    if nargs > 1:
        error("%d arguments are too many;" % nargs)
    elif nargs == 1:
        try: loops = int(sys.argv[1])
        except ValueError:
            error("Invalid argument %r;" % sys.argv[1])
    else:
        loops = LOOPS
    main(loops)
''',
        """
        0 NEWLINE
        1 NAME LOOPS
        2 EQUAL =
        3 NUMBER 50000
        4 NEWLINE
        5 NEWLINE
        6 NAME from
        7 NAME time
        8 NAME import
        9 NAME clock
        10 NEWLINE
        11 NEWLINE
        12 NAME __version__
        13 EQUAL =
        14 STRING "1.2"
        15 NEWLINE
        16 NEWLINE
        17 LSQB [
        18 NAME Ident1
        19 COMMA ,
        20 NAME Ident2
        21 COMMA ,
        22 NAME Ident3
        23 COMMA ,
        24 NAME Ident4
        25 COMMA ,
        26 NAME Ident5
        27 RSQB ]
        28 EQUAL =
        29 NAME range
        30 LPAR (
        31 NUMBER 1
        32 COMMA ,
        33 NUMBER 6
        34 RPAR )
        35 NEWLINE
        36 NEWLINE
        37 NAME class
        38 NAME Record
        39 COLON :
        40 NEWLINE
        41 NEWLINE
        42 INDENT
        43 NAME def
        44 NAME __init__
        45 LPAR (
        46 NAME self
        47 COMMA ,
        48 NAME PtrComp
        49 EQUAL =
        50 NAME None
        51 COMMA ,
        52 NAME Discr
        53 EQUAL =
        54 NUMBER 0
        55 COMMA ,
        56 NAME EnumComp
        57 EQUAL =
        58 NUMBER 0
        59 COMMA ,
        60 NAME IntComp
        61 EQUAL =
        62 NUMBER 0
        63 COMMA ,
        64 NAME StringComp
        65 EQUAL =
        66 NUMBER 0
        67 RPAR )
        68 COLON :
        69 NEWLINE
        70 INDENT
        71 NAME self
        72 DOT .
        73 NAME PtrComp
        74 EQUAL =
        75 NAME PtrComp
        76 NEWLINE
        77 NAME self
        78 DOT .
        79 NAME Discr
        80 EQUAL =
        81 NAME Discr
        82 NEWLINE
        83 NAME self
        84 DOT .
        85 NAME EnumComp
        86 EQUAL =
        87 NAME EnumComp
        88 NEWLINE
        89 NAME self
        90 DOT .
        91 NAME IntComp
        92 EQUAL =
        93 NAME IntComp
        94 NEWLINE
        95 NAME self
        96 DOT .
        97 NAME StringComp
        98 EQUAL =
        99 NAME StringComp
        100 NEWLINE
        101 NEWLINE
        102 DEDENT
        103 NAME def
        104 NAME copy
        105 LPAR (
        106 NAME self
        107 RPAR )
        108 COLON :
        109 NEWLINE
        110 INDENT
        111 NAME return
        112 NAME Record
        113 LPAR (
        114 NAME self
        115 DOT .
        116 NAME PtrComp
        117 COMMA ,
        118 NAME self
        119 DOT .
        120 NAME Discr
        121 COMMA ,
        122 NAME self
        123 DOT .
        124 NAME EnumComp
        125 COMMA ,
        126 NAME self
        127 DOT .
        128 NAME IntComp
        129 COMMA ,
        130 NAME self
        131 DOT .
        132 NAME StringComp
        133 RPAR )
        134 NEWLINE
        135 NEWLINE
        136 DEDENT
        137 DEDENT
        138 NAME TRUE
        139 EQUAL =
        140 NUMBER 1
        141 NEWLINE
        142 NAME FALSE
        143 EQUAL =
        144 NUMBER 0
        145 NEWLINE
        146 NEWLINE
        147 NAME def
        148 NAME main
        149 LPAR (
        150 NAME loops
        151 EQUAL =
        152 NAME LOOPS
        153 RPAR )
        154 COLON :
        155 NEWLINE
        156 INDENT
        157 NAME benchtime
        158 COMMA ,
        159 NAME stones
        160 EQUAL =
        161 NAME pystones
        162 LPAR (
        163 NAME loops
        164 RPAR )
        165 NEWLINE
        166 NAME print
        167 LPAR (
        168 STRING "Pystone(%s) time for %d passes = %g"
        169 PERCENT %
        170 LPAR (
        171 NAME __version__
        172 COMMA ,
        173 NAME loops
        174 COMMA ,
        175 NAME benchtime
        176 RPAR )
        177 RPAR )
        178 NEWLINE
        179 NAME print
        180 LPAR (
        181 STRING "This machine benchmarks at %g pystones/second"
        182 PERCENT %
        183 NAME stones
        184 RPAR )
        185 NEWLINE
        186 NEWLINE
        187 NEWLINE
        188 DEDENT
        189 NAME def
        190 NAME pystones
        191 LPAR (
        192 NAME loops
        193 EQUAL =
        194 NAME LOOPS
        195 RPAR )
        196 COLON :
        197 NEWLINE
        198 INDENT
        199 NAME return
        200 NAME Proc0
        201 LPAR (
        202 NAME loops
        203 RPAR )
        204 NEWLINE
        205 NEWLINE
        206 DEDENT
        207 NAME IntGlob
        208 EQUAL =
        209 NUMBER 0
        210 NEWLINE
        211 NAME BoolGlob
        212 EQUAL =
        213 NAME FALSE
        214 NEWLINE
        215 NAME Char1Glob
        216 EQUAL =
        217 STRING '\\0'
        218 NEWLINE
        219 NAME Char2Glob
        220 EQUAL =
        221 STRING '\\0'
        222 NEWLINE
        223 NAME Array1Glob
        224 EQUAL =
        225 LSQB [
        226 NUMBER 0
        227 RSQB ]
        228 STAR *
        229 NUMBER 51
        230 NEWLINE
        231 NAME Array2Glob
        232 EQUAL =
        233 LSQB [
        234 NAME x
        235 LSQB [
        236 COLON :
        237 RSQB ]
        238 NAME for
        239 NAME x
        240 NAME in
        241 LSQB [
        242 NAME Array1Glob
        243 RSQB ]
        244 STAR *
        245 NUMBER 51
        246 RSQB ]
        247 NEWLINE
        248 NAME PtrGlb
        249 EQUAL =
        250 NAME None
        251 NEWLINE
        252 NAME PtrGlbNext
        253 EQUAL =
        254 NAME None
        255 NEWLINE
        256 NEWLINE
        257 NAME def
        258 NAME Proc0
        259 LPAR (
        260 NAME loops
        261 EQUAL =
        262 NAME LOOPS
        263 RPAR )
        264 COLON :
        265 NEWLINE
        266 INDENT
        267 NAME global
        268 NAME IntGlob
        269 NEWLINE
        270 NAME global
        271 NAME BoolGlob
        272 NEWLINE
        273 NAME global
        274 NAME Char1Glob
        275 NEWLINE
        276 NAME global
        277 NAME Char2Glob
        278 NEWLINE
        279 NAME global
        280 NAME Array1Glob
        281 NEWLINE
        282 NAME global
        283 NAME Array2Glob
        284 NEWLINE
        285 NAME global
        286 NAME PtrGlb
        287 NEWLINE
        288 NAME global
        289 NAME PtrGlbNext
        290 NEWLINE
        291 NEWLINE
        292 NAME starttime
        293 EQUAL =
        294 NAME clock
        295 LPAR (
        296 RPAR )
        297 NEWLINE
        298 NAME for
        299 NAME i
        300 NAME in
        301 NAME range
        302 LPAR (
        303 NAME loops
        304 RPAR )
        305 COLON :
        306 NEWLINE
        307 INDENT
        308 NAME pass
        309 NEWLINE
        310 DEDENT
        311 NAME nulltime
        312 EQUAL =
        313 NAME clock
        314 LPAR (
        315 RPAR )
        316 MINUS -
        317 NAME starttime
        318 NEWLINE
        319 NEWLINE
        320 NAME PtrGlbNext
        321 EQUAL =
        322 NAME Record
        323 LPAR (
        324 RPAR )
        325 NEWLINE
        326 NAME PtrGlb
        327 EQUAL =
        328 NAME Record
        329 LPAR (
        330 RPAR )
        331 NEWLINE
        332 NAME PtrGlb
        333 DOT .
        334 NAME PtrComp
        335 EQUAL =
        336 NAME PtrGlbNext
        337 NEWLINE
        338 NAME PtrGlb
        339 DOT .
        340 NAME Discr
        341 EQUAL =
        342 NAME Ident1
        343 NEWLINE
        344 NAME PtrGlb
        345 DOT .
        346 NAME EnumComp
        347 EQUAL =
        348 NAME Ident3
        349 NEWLINE
        350 NAME PtrGlb
        351 DOT .
        352 NAME IntComp
        353 EQUAL =
        354 NUMBER 40
        355 NEWLINE
        356 NAME PtrGlb
        357 DOT .
        358 NAME StringComp
        359 EQUAL =
        360 STRING "DHRYSTONE PROGRAM, SOME STRING"
        361 NEWLINE
        362 NAME String1Loc
        363 EQUAL =
        364 STRING "DHRYSTONE PROGRAM, 1'ST STRING"
        365 NEWLINE
        366 NAME Array2Glob
        367 LSQB [
        368 NUMBER 8
        369 RSQB ]
        370 LSQB [
        371 NUMBER 7
        372 RSQB ]
        373 EQUAL =
        374 NUMBER 10
        375 NEWLINE
        376 NEWLINE
        377 NAME starttime
        378 EQUAL =
        379 NAME clock
        380 LPAR (
        381 RPAR )
        382 NEWLINE
        383 NEWLINE
        384 NAME for
        385 NAME i
        386 NAME in
        387 NAME range
        388 LPAR (
        389 NAME loops
        390 RPAR )
        391 COLON :
        392 NEWLINE
        393 INDENT
        394 NAME Proc5
        395 LPAR (
        396 RPAR )
        397 NEWLINE
        398 NAME Proc4
        399 LPAR (
        400 RPAR )
        401 NEWLINE
        402 NAME IntLoc1
        403 EQUAL =
        404 NUMBER 2
        405 NEWLINE
        406 NAME IntLoc2
        407 EQUAL =
        408 NUMBER 3
        409 NEWLINE
        410 NAME String2Loc
        411 EQUAL =
        412 STRING "DHRYSTONE PROGRAM, 2'ND STRING"
        413 NEWLINE
        414 NAME EnumLoc
        415 EQUAL =
        416 NAME Ident2
        417 NEWLINE
        418 NAME BoolGlob
        419 EQUAL =
        420 NAME not
        421 NAME Func2
        422 LPAR (
        423 NAME String1Loc
        424 COMMA ,
        425 NAME String2Loc
        426 RPAR )
        427 NEWLINE
        428 NAME while
        429 NAME IntLoc1
        430 LESS <
        431 NAME IntLoc2
        432 COLON :
        433 NEWLINE
        434 INDENT
        435 NAME IntLoc3
        436 EQUAL =
        437 NUMBER 5
        438 STAR *
        439 NAME IntLoc1
        440 MINUS -
        441 NAME IntLoc2
        442 NEWLINE
        443 NAME IntLoc3
        444 EQUAL =
        445 NAME Proc7
        446 LPAR (
        447 NAME IntLoc1
        448 COMMA ,
        449 NAME IntLoc2
        450 RPAR )
        451 NEWLINE
        452 NAME IntLoc1
        453 EQUAL =
        454 NAME IntLoc1
        455 PLUS +
        456 NUMBER 1
        457 NEWLINE
        458 DEDENT
        459 NAME Proc8
        460 LPAR (
        461 NAME Array1Glob
        462 COMMA ,
        463 NAME Array2Glob
        464 COMMA ,
        465 NAME IntLoc1
        466 COMMA ,
        467 NAME IntLoc3
        468 RPAR )
        469 NEWLINE
        470 NAME PtrGlb
        471 EQUAL =
        472 NAME Proc1
        473 LPAR (
        474 NAME PtrGlb
        475 RPAR )
        476 NEWLINE
        477 NAME CharIndex
        478 EQUAL =
        479 STRING 'A'
        480 NEWLINE
        481 NAME while
        482 NAME CharIndex
        483 LESSEQUAL <=
        484 NAME Char2Glob
        485 COLON :
        486 NEWLINE
        487 INDENT
        488 NAME if
        489 NAME EnumLoc
        490 EQEQUAL ==
        491 NAME Func1
        492 LPAR (
        493 NAME CharIndex
        494 COMMA ,
        495 STRING 'C'
        496 RPAR )
        497 COLON :
        498 NEWLINE
        499 INDENT
        500 NAME EnumLoc
        501 EQUAL =
        502 NAME Proc6
        503 LPAR (
        504 NAME Ident1
        505 RPAR )
        506 NEWLINE
        507 DEDENT
        508 NAME CharIndex
        509 EQUAL =
        510 NAME chr
        511 LPAR (
        512 NAME ord
        513 LPAR (
        514 NAME CharIndex
        515 RPAR )
        516 PLUS +
        517 NUMBER 1
        518 RPAR )
        519 NEWLINE
        520 DEDENT
        521 NAME IntLoc3
        522 EQUAL =
        523 NAME IntLoc2
        524 STAR *
        525 NAME IntLoc1
        526 NEWLINE
        527 NAME IntLoc2
        528 EQUAL =
        529 NAME IntLoc3
        530 DOUBLESLASH //
        531 NAME IntLoc1
        532 NEWLINE
        533 NAME IntLoc2
        534 EQUAL =
        535 NUMBER 7
        536 STAR *
        537 LPAR (
        538 NAME IntLoc3
        539 MINUS -
        540 NAME IntLoc2
        541 RPAR )
        542 MINUS -
        543 NAME IntLoc1
        544 NEWLINE
        545 NAME IntLoc1
        546 EQUAL =
        547 NAME Proc2
        548 LPAR (
        549 NAME IntLoc1
        550 RPAR )
        551 NEWLINE
        552 NEWLINE
        553 DEDENT
        554 NAME benchtime
        555 EQUAL =
        556 NAME clock
        557 LPAR (
        558 RPAR )
        559 MINUS -
        560 NAME starttime
        561 MINUS -
        562 NAME nulltime
        563 NEWLINE
        564 NAME if
        565 NAME benchtime
        566 EQEQUAL ==
        567 NUMBER 0.0
        568 COLON :
        569 NEWLINE
        570 INDENT
        571 NAME loopsPerBenchtime
        572 EQUAL =
        573 NUMBER 0.0
        574 NEWLINE
        575 DEDENT
        576 NAME else
        577 COLON :
        578 NEWLINE
        579 INDENT
        580 NAME loopsPerBenchtime
        581 EQUAL =
        582 LPAR (
        583 NAME loops
        584 SLASH /
        585 NAME benchtime
        586 RPAR )
        587 NEWLINE
        588 DEDENT
        589 NAME return
        590 NAME benchtime
        591 COMMA ,
        592 NAME loopsPerBenchtime
        593 NEWLINE
        594 NEWLINE
        595 DEDENT
        596 NAME def
        597 NAME Proc1
        598 LPAR (
        599 NAME PtrParIn
        600 RPAR )
        601 COLON :
        602 NEWLINE
        603 INDENT
        604 NAME PtrParIn
        605 DOT .
        606 NAME PtrComp
        607 EQUAL =
        608 NAME NextRecord
        609 EQUAL =
        610 NAME PtrGlb
        611 DOT .
        612 NAME copy
        613 LPAR (
        614 RPAR )
        615 NEWLINE
        616 NAME PtrParIn
        617 DOT .
        618 NAME IntComp
        619 EQUAL =
        620 NUMBER 5
        621 NEWLINE
        622 NAME NextRecord
        623 DOT .
        624 NAME IntComp
        625 EQUAL =
        626 NAME PtrParIn
        627 DOT .
        628 NAME IntComp
        629 NEWLINE
        630 NAME NextRecord
        631 DOT .
        632 NAME PtrComp
        633 EQUAL =
        634 NAME PtrParIn
        635 DOT .
        636 NAME PtrComp
        637 NEWLINE
        638 NAME NextRecord
        639 DOT .
        640 NAME PtrComp
        641 EQUAL =
        642 NAME Proc3
        643 LPAR (
        644 NAME NextRecord
        645 DOT .
        646 NAME PtrComp
        647 RPAR )
        648 NEWLINE
        649 NAME if
        650 NAME NextRecord
        651 DOT .
        652 NAME Discr
        653 EQEQUAL ==
        654 NAME Ident1
        655 COLON :
        656 NEWLINE
        657 INDENT
        658 NAME NextRecord
        659 DOT .
        660 NAME IntComp
        661 EQUAL =
        662 NUMBER 6
        663 NEWLINE
        664 NAME NextRecord
        665 DOT .
        666 NAME EnumComp
        667 EQUAL =
        668 NAME Proc6
        669 LPAR (
        670 NAME PtrParIn
        671 DOT .
        672 NAME EnumComp
        673 RPAR )
        674 NEWLINE
        675 NAME NextRecord
        676 DOT .
        677 NAME PtrComp
        678 EQUAL =
        679 NAME PtrGlb
        680 DOT .
        681 NAME PtrComp
        682 NEWLINE
        683 NAME NextRecord
        684 DOT .
        685 NAME IntComp
        686 EQUAL =
        687 NAME Proc7
        688 LPAR (
        689 NAME NextRecord
        690 DOT .
        691 NAME IntComp
        692 COMMA ,
        693 NUMBER 10
        694 RPAR )
        695 NEWLINE
        696 DEDENT
        697 NAME else
        698 COLON :
        699 NEWLINE
        700 INDENT
        701 NAME PtrParIn
        702 EQUAL =
        703 NAME NextRecord
        704 DOT .
        705 NAME copy
        706 LPAR (
        707 RPAR )
        708 NEWLINE
        709 DEDENT
        710 NAME NextRecord
        711 DOT .
        712 NAME PtrComp
        713 EQUAL =
        714 NAME None
        715 NEWLINE
        716 NAME return
        717 NAME PtrParIn
        718 NEWLINE
        719 NEWLINE
        720 DEDENT
        721 NAME def
        722 NAME Proc2
        723 LPAR (
        724 NAME IntParIO
        725 RPAR )
        726 COLON :
        727 NEWLINE
        728 INDENT
        729 NAME IntLoc
        730 EQUAL =
        731 NAME IntParIO
        732 PLUS +
        733 NUMBER 10
        734 NEWLINE
        735 NAME while
        736 NUMBER 1
        737 COLON :
        738 NEWLINE
        739 INDENT
        740 NAME if
        741 NAME Char1Glob
        742 EQEQUAL ==
        743 STRING 'A'
        744 COLON :
        745 NEWLINE
        746 INDENT
        747 NAME IntLoc
        748 EQUAL =
        749 NAME IntLoc
        750 MINUS -
        751 NUMBER 1
        752 NEWLINE
        753 NAME IntParIO
        754 EQUAL =
        755 NAME IntLoc
        756 MINUS -
        757 NAME IntGlob
        758 NEWLINE
        759 NAME EnumLoc
        760 EQUAL =
        761 NAME Ident1
        762 NEWLINE
        763 DEDENT
        764 NAME if
        765 NAME EnumLoc
        766 EQEQUAL ==
        767 NAME Ident1
        768 COLON :
        769 NEWLINE
        770 INDENT
        771 NAME break
        772 NEWLINE
        773 DEDENT
        774 DEDENT
        775 NAME return
        776 NAME IntParIO
        777 NEWLINE
        778 NEWLINE
        779 DEDENT
        780 NAME def
        781 NAME Proc3
        782 LPAR (
        783 NAME PtrParOut
        784 RPAR )
        785 COLON :
        786 NEWLINE
        787 INDENT
        788 NAME global
        789 NAME IntGlob
        790 NEWLINE
        791 NEWLINE
        792 NAME if
        793 NAME PtrGlb
        794 NAME is
        795 NAME not
        796 NAME None
        797 COLON :
        798 NEWLINE
        799 INDENT
        800 NAME PtrParOut
        801 EQUAL =
        802 NAME PtrGlb
        803 DOT .
        804 NAME PtrComp
        805 NEWLINE
        806 DEDENT
        807 NAME else
        808 COLON :
        809 NEWLINE
        810 INDENT
        811 NAME IntGlob
        812 EQUAL =
        813 NUMBER 100
        814 NEWLINE
        815 DEDENT
        816 NAME PtrGlb
        817 DOT .
        818 NAME IntComp
        819 EQUAL =
        820 NAME Proc7
        821 LPAR (
        822 NUMBER 10
        823 COMMA ,
        824 NAME IntGlob
        825 RPAR )
        826 NEWLINE
        827 NAME return
        828 NAME PtrParOut
        829 NEWLINE
        830 NEWLINE
        831 DEDENT
        832 NAME def
        833 NAME Proc4
        834 LPAR (
        835 RPAR )
        836 COLON :
        837 NEWLINE
        838 INDENT
        839 NAME global
        840 NAME Char2Glob
        841 NEWLINE
        842 NEWLINE
        843 NAME BoolLoc
        844 EQUAL =
        845 NAME Char1Glob
        846 EQEQUAL ==
        847 STRING 'A'
        848 NEWLINE
        849 NAME BoolLoc
        850 EQUAL =
        851 NAME BoolLoc
        852 NAME or
        853 NAME BoolGlob
        854 NEWLINE
        855 NAME Char2Glob
        856 EQUAL =
        857 STRING 'B'
        858 NEWLINE
        859 NEWLINE
        860 DEDENT
        861 NAME def
        862 NAME Proc5
        863 LPAR (
        864 RPAR )
        865 COLON :
        866 NEWLINE
        867 INDENT
        868 NAME global
        869 NAME Char1Glob
        870 NEWLINE
        871 NAME global
        872 NAME BoolGlob
        873 NEWLINE
        874 NEWLINE
        875 NAME Char1Glob
        876 EQUAL =
        877 STRING 'A'
        878 NEWLINE
        879 NAME BoolGlob
        880 EQUAL =
        881 NAME FALSE
        882 NEWLINE
        883 NEWLINE
        884 DEDENT
        885 NAME def
        886 NAME Proc6
        887 LPAR (
        888 NAME EnumParIn
        889 RPAR )
        890 COLON :
        891 NEWLINE
        892 INDENT
        893 NAME EnumParOut
        894 EQUAL =
        895 NAME EnumParIn
        896 NEWLINE
        897 NAME if
        898 NAME not
        899 NAME Func3
        900 LPAR (
        901 NAME EnumParIn
        902 RPAR )
        903 COLON :
        904 NEWLINE
        905 INDENT
        906 NAME EnumParOut
        907 EQUAL =
        908 NAME Ident4
        909 NEWLINE
        910 DEDENT
        911 NAME if
        912 NAME EnumParIn
        913 EQEQUAL ==
        914 NAME Ident1
        915 COLON :
        916 NEWLINE
        917 INDENT
        918 NAME EnumParOut
        919 EQUAL =
        920 NAME Ident1
        921 NEWLINE
        922 DEDENT
        923 NAME elif
        924 NAME EnumParIn
        925 EQEQUAL ==
        926 NAME Ident2
        927 COLON :
        928 NEWLINE
        929 INDENT
        930 NAME if
        931 NAME IntGlob
        932 GREATER >
        933 NUMBER 100
        934 COLON :
        935 NEWLINE
        936 INDENT
        937 NAME EnumParOut
        938 EQUAL =
        939 NAME Ident1
        940 NEWLINE
        941 DEDENT
        942 NAME else
        943 COLON :
        944 NEWLINE
        945 INDENT
        946 NAME EnumParOut
        947 EQUAL =
        948 NAME Ident4
        949 NEWLINE
        950 DEDENT
        951 DEDENT
        952 NAME elif
        953 NAME EnumParIn
        954 EQEQUAL ==
        955 NAME Ident3
        956 COLON :
        957 NEWLINE
        958 INDENT
        959 NAME EnumParOut
        960 EQUAL =
        961 NAME Ident2
        962 NEWLINE
        963 DEDENT
        964 NAME elif
        965 NAME EnumParIn
        966 EQEQUAL ==
        967 NAME Ident4
        968 COLON :
        969 NEWLINE
        970 INDENT
        971 NAME pass
        972 NEWLINE
        973 DEDENT
        974 NAME elif
        975 NAME EnumParIn
        976 EQEQUAL ==
        977 NAME Ident5
        978 COLON :
        979 NEWLINE
        980 INDENT
        981 NAME EnumParOut
        982 EQUAL =
        983 NAME Ident3
        984 NEWLINE
        985 DEDENT
        986 NAME return
        987 NAME EnumParOut
        988 NEWLINE
        989 NEWLINE
        990 DEDENT
        991 NAME def
        992 NAME Proc7
        993 LPAR (
        994 NAME IntParI1
        995 COMMA ,
        996 NAME IntParI2
        997 RPAR )
        998 COLON :
        999 NEWLINE
        1000 INDENT
        1001 NAME IntLoc
        1002 EQUAL =
        1003 NAME IntParI1
        1004 PLUS +
        1005 NUMBER 2
        1006 NEWLINE
        1007 NAME IntParOut
        1008 EQUAL =
        1009 NAME IntParI2
        1010 PLUS +
        1011 NAME IntLoc
        1012 NEWLINE
        1013 NAME return
        1014 NAME IntParOut
        1015 NEWLINE
        1016 NEWLINE
        1017 DEDENT
        1018 NAME def
        1019 NAME Proc8
        1020 LPAR (
        1021 NAME Array1Par
        1022 COMMA ,
        1023 NAME Array2Par
        1024 COMMA ,
        1025 NAME IntParI1
        1026 COMMA ,
        1027 NAME IntParI2
        1028 RPAR )
        1029 COLON :
        1030 NEWLINE
        1031 INDENT
        1032 NAME global
        1033 NAME IntGlob
        1034 NEWLINE
        1035 NEWLINE
        1036 NAME IntLoc
        1037 EQUAL =
        1038 NAME IntParI1
        1039 PLUS +
        1040 NUMBER 5
        1041 NEWLINE
        1042 NAME Array1Par
        1043 LSQB [
        1044 NAME IntLoc
        1045 RSQB ]
        1046 EQUAL =
        1047 NAME IntParI2
        1048 NEWLINE
        1049 NAME Array1Par
        1050 LSQB [
        1051 NAME IntLoc
        1052 PLUS +
        1053 NUMBER 1
        1054 RSQB ]
        1055 EQUAL =
        1056 NAME Array1Par
        1057 LSQB [
        1058 NAME IntLoc
        1059 RSQB ]
        1060 NEWLINE
        1061 NAME Array1Par
        1062 LSQB [
        1063 NAME IntLoc
        1064 PLUS +
        1065 NUMBER 30
        1066 RSQB ]
        1067 EQUAL =
        1068 NAME IntLoc
        1069 NEWLINE
        1070 NAME for
        1071 NAME IntIndex
        1072 NAME in
        1073 NAME range
        1074 LPAR (
        1075 NAME IntLoc
        1076 COMMA ,
        1077 NAME IntLoc
        1078 PLUS +
        1079 NUMBER 2
        1080 RPAR )
        1081 COLON :
        1082 NEWLINE
        1083 INDENT
        1084 NAME Array2Par
        1085 LSQB [
        1086 NAME IntLoc
        1087 RSQB ]
        1088 LSQB [
        1089 NAME IntIndex
        1090 RSQB ]
        1091 EQUAL =
        1092 NAME IntLoc
        1093 NEWLINE
        1094 DEDENT
        1095 NAME Array2Par
        1096 LSQB [
        1097 NAME IntLoc
        1098 RSQB ]
        1099 LSQB [
        1100 NAME IntLoc
        1101 MINUS -
        1102 NUMBER 1
        1103 RSQB ]
        1104 EQUAL =
        1105 NAME Array2Par
        1106 LSQB [
        1107 NAME IntLoc
        1108 RSQB ]
        1109 LSQB [
        1110 NAME IntLoc
        1111 MINUS -
        1112 NUMBER 1
        1113 RSQB ]
        1114 PLUS +
        1115 NUMBER 1
        1116 NEWLINE
        1117 NAME Array2Par
        1118 LSQB [
        1119 NAME IntLoc
        1120 PLUS +
        1121 NUMBER 20
        1122 RSQB ]
        1123 LSQB [
        1124 NAME IntLoc
        1125 RSQB ]
        1126 EQUAL =
        1127 NAME Array1Par
        1128 LSQB [
        1129 NAME IntLoc
        1130 RSQB ]
        1131 NEWLINE
        1132 NAME IntGlob
        1133 EQUAL =
        1134 NUMBER 5
        1135 NEWLINE
        1136 NEWLINE
        1137 DEDENT
        1138 NAME def
        1139 NAME Func1
        1140 LPAR (
        1141 NAME CharPar1
        1142 COMMA ,
        1143 NAME CharPar2
        1144 RPAR )
        1145 COLON :
        1146 NEWLINE
        1147 INDENT
        1148 NAME CharLoc1
        1149 EQUAL =
        1150 NAME CharPar1
        1151 NEWLINE
        1152 NAME CharLoc2
        1153 EQUAL =
        1154 NAME CharLoc1
        1155 NEWLINE
        1156 NAME if
        1157 NAME CharLoc2
        1158 NOTEQUAL !=
        1159 NAME CharPar2
        1160 COLON :
        1161 NEWLINE
        1162 INDENT
        1163 NAME return
        1164 NAME Ident1
        1165 NEWLINE
        1166 DEDENT
        1167 NAME else
        1168 COLON :
        1169 NEWLINE
        1170 INDENT
        1171 NAME return
        1172 NAME Ident2
        1173 NEWLINE
        1174 NEWLINE
        1175 DEDENT
        1176 DEDENT
        1177 NAME def
        1178 NAME Func2
        1179 LPAR (
        1180 NAME StrParI1
        1181 COMMA ,
        1182 NAME StrParI2
        1183 RPAR )
        1184 COLON :
        1185 NEWLINE
        1186 INDENT
        1187 NAME IntLoc
        1188 EQUAL =
        1189 NUMBER 1
        1190 NEWLINE
        1191 NAME while
        1192 NAME IntLoc
        1193 LESSEQUAL <=
        1194 NUMBER 1
        1195 COLON :
        1196 NEWLINE
        1197 INDENT
        1198 NAME if
        1199 NAME Func1
        1200 LPAR (
        1201 NAME StrParI1
        1202 LSQB [
        1203 NAME IntLoc
        1204 RSQB ]
        1205 COMMA ,
        1206 NAME StrParI2
        1207 LSQB [
        1208 NAME IntLoc
        1209 PLUS +
        1210 NUMBER 1
        1211 RSQB ]
        1212 RPAR )
        1213 EQEQUAL ==
        1214 NAME Ident1
        1215 COLON :
        1216 NEWLINE
        1217 INDENT
        1218 NAME CharLoc
        1219 EQUAL =
        1220 STRING 'A'
        1221 NEWLINE
        1222 NAME IntLoc
        1223 EQUAL =
        1224 NAME IntLoc
        1225 PLUS +
        1226 NUMBER 1
        1227 NEWLINE
        1228 DEDENT
        1229 DEDENT
        1230 NAME if
        1231 NAME CharLoc
        1232 GREATEREQUAL >=
        1233 STRING 'W'
        1234 NAME and
        1235 NAME CharLoc
        1236 LESSEQUAL <=
        1237 STRING 'Z'
        1238 COLON :
        1239 NEWLINE
        1240 INDENT
        1241 NAME IntLoc
        1242 EQUAL =
        1243 NUMBER 7
        1244 NEWLINE
        1245 DEDENT
        1246 NAME if
        1247 NAME CharLoc
        1248 EQEQUAL ==
        1249 STRING 'X'
        1250 COLON :
        1251 NEWLINE
        1252 INDENT
        1253 NAME return
        1254 NAME TRUE
        1255 NEWLINE
        1256 DEDENT
        1257 NAME else
        1258 COLON :
        1259 NEWLINE
        1260 INDENT
        1261 NAME if
        1262 NAME StrParI1
        1263 GREATER >
        1264 NAME StrParI2
        1265 COLON :
        1266 NEWLINE
        1267 INDENT
        1268 NAME IntLoc
        1269 EQUAL =
        1270 NAME IntLoc
        1271 PLUS +
        1272 NUMBER 7
        1273 NEWLINE
        1274 NAME return
        1275 NAME TRUE
        1276 NEWLINE
        1277 DEDENT
        1278 NAME else
        1279 COLON :
        1280 NEWLINE
        1281 INDENT
        1282 NAME return
        1283 NAME FALSE
        1284 NEWLINE
        1285 NEWLINE
        1286 DEDENT
        1287 DEDENT
        1288 DEDENT
        1289 NAME def
        1290 NAME Func3
        1291 LPAR (
        1292 NAME EnumParIn
        1293 RPAR )
        1294 COLON :
        1295 NEWLINE
        1296 INDENT
        1297 NAME EnumLoc
        1298 EQUAL =
        1299 NAME EnumParIn
        1300 NEWLINE
        1301 NAME if
        1302 NAME EnumLoc
        1303 EQEQUAL ==
        1304 NAME Ident3
        1305 COLON :
        1306 NAME return
        1307 NAME TRUE
        1308 NEWLINE
        1309 NAME return
        1310 NAME FALSE
        1311 NEWLINE
        1312 NEWLINE
        1313 DEDENT
        1314 NAME if
        1315 NAME __name__
        1316 EQEQUAL ==
        1317 STRING '__main__'
        1318 COLON :
        1319 NEWLINE
        1320 INDENT
        1321 NAME import
        1322 NAME sys
        1323 NEWLINE
        1324 NAME def
        1325 NAME error
        1326 LPAR (
        1327 NAME msg
        1328 RPAR )
        1329 COLON :
        1330 NEWLINE
        1331 INDENT
        1332 NAME print
        1333 LPAR (
        1334 NAME msg
        1335 COMMA ,
        1336 NAME end
        1337 EQUAL =
        1338 STRING ' '
        1339 COMMA ,
        1340 NAME file
        1341 EQUAL =
        1342 NAME sys
        1343 DOT .
        1344 NAME stderr
        1345 RPAR )
        1346 NEWLINE
        1347 NAME print
        1348 LPAR (
        1349 STRING "usage: %s [number_of_loops]"
        1350 PERCENT %
        1351 NAME sys
        1352 DOT .
        1353 NAME argv
        1354 LSQB [
        1355 NUMBER 0
        1356 RSQB ]
        1357 COMMA ,
        1358 NAME file
        1359 EQUAL =
        1360 NAME sys
        1361 DOT .
        1362 NAME stderr
        1363 RPAR )
        1364 NEWLINE
        1365 NAME sys
        1366 DOT .
        1367 NAME exit
        1368 LPAR (
        1369 NUMBER 100
        1370 RPAR )
        1371 NEWLINE
        1372 DEDENT
        1373 NAME nargs
        1374 EQUAL =
        1375 NAME len
        1376 LPAR (
        1377 NAME sys
        1378 DOT .
        1379 NAME argv
        1380 RPAR )
        1381 MINUS -
        1382 NUMBER 1
        1383 NEWLINE
        1384 NAME if
        1385 NAME nargs
        1386 GREATER >
        1387 NUMBER 1
        1388 COLON :
        1389 NEWLINE
        1390 INDENT
        1391 NAME error
        1392 LPAR (
        1393 STRING "%d arguments are too many;"
        1394 PERCENT %
        1395 NAME nargs
        1396 RPAR )
        1397 NEWLINE
        1398 DEDENT
        1399 NAME elif
        1400 NAME nargs
        1401 EQEQUAL ==
        1402 NUMBER 1
        1403 COLON :
        1404 NEWLINE
        1405 INDENT
        1406 NAME try
        1407 COLON :
        1408 NAME loops
        1409 EQUAL =
        1410 NAME int
        1411 LPAR (
        1412 NAME sys
        1413 DOT .
        1414 NAME argv
        1415 LSQB [
        1416 NUMBER 1
        1417 RSQB ]
        1418 RPAR )
        1419 NEWLINE
        1420 NAME except
        1421 NAME ValueError
        1422 COLON :
        1423 NEWLINE
        1424 INDENT
        1425 NAME error
        1426 LPAR (
        1427 STRING "Invalid argument %r;"
        1428 PERCENT %
        1429 NAME sys
        1430 DOT .
        1431 NAME argv
        1432 LSQB [
        1433 NUMBER 1
        1434 RSQB ]
        1435 RPAR )
        1436 NEWLINE
        1437 DEDENT
        1438 DEDENT
        1439 NAME else
        1440 COLON :
        1441 NEWLINE
        1442 INDENT
        1443 NAME loops
        1444 EQUAL =
        1445 NAME LOOPS
        1446 NEWLINE
        1447 DEDENT
        1448 NAME main
        1449 LPAR (
        1450 NAME loops
        1451 RPAR )
        """)
