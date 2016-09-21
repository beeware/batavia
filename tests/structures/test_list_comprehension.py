from ..utils import TranspileTestCase

import unittest


class ListComprehensionTests(TranspileTestCase):
    def test_syntax(self):
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print([v**2 for v in x])
            print('Done.')
            """)

    def test_method(self):
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(list(v**2 for v in x))
            print('Done.')
            """)

    # copy of this.py -- a nice exercise of list comprehensions
    def test_import_this(self):
        self.assertCodeExecution('''
            s = """Gur Mra bs Clguba, ol Gvz Crgref

            Ornhgvshy vf orggre guna htyl.
            Rkcyvpvg vf orggre guna vzcyvpvg.
            Fvzcyr vf orggre guna pbzcyrk.
            Pbzcyrk vf orggre guna pbzcyvpngrq.
            Syng vf orggre guna arfgrq.
            Fcnefr vf orggre guna qrafr.
            Ernqnovyvgl pbhagf.
            Fcrpvny pnfrf nera'g fcrpvny rabhtu gb oernx gur ehyrf.
            Nygubhtu cenpgvpnyvgl orngf chevgl.
            Reebef fubhyq arire cnff fvyragyl.
            Hayrff rkcyvpvgyl fvyraprq.
            Va gur snpr bs nzovthvgl, ershfr gur grzcgngvba gb thrff.
            Gurer fubhyq or bar-- naq cersrenoyl bayl bar --boivbhf jnl gb qb vg.
            Nygubhtu gung jnl znl abg or boivbhf ng svefg hayrff lbh'er Qhgpu.
            Abj vf orggre guna arire.
            Nygubhtu arire vf bsgra orggre guna *evtug* abj.
            Vs gur vzcyrzragngvba vf uneq gb rkcynva, vg'f n onq vqrn.
            Vs gur vzcyrzragngvba vf rnfl gb rkcynva, vg znl or n tbbq vqrn.
            Anzrfcnprf ner bar ubaxvat terng vqrn -- yrg'f qb zber bs gubfr!"""

            d = {}
            for c in (65, 97):
                for i in range(26):
                    d[chr(i+c)] = chr((i+13) % 26 + c)

            print("".join([d.get(c, c) for c in s]))
            ''',
            substitutions={
                # workaround for PhantomJS producing extra new lines which we have to squash
                "Peters\n\nBeautiful": ["Peters\nBeautiful",]
            })
