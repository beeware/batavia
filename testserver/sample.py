import dom
import other


class Point:
    def __init__(self, x, y, z=4):
        self.x = x
        self.y = y
        self.z = z

    def distance(self):
        return self.x ** 2 + self.y ** 2 + self.z ** 2


def do_stuff(count, size=3):
    print("Size is ", 3)
    for i in range(0, count):
        print("HELLO", i)
        other.wiggle(i)

def try_builtins():
    print('sum(0,1,2,3,4)', sum([0, 1, 2, 3, 4]))
    print('abs(-1)', abs(-1))
    print(bool.__doc__)
    print('min(1,2,3,4)', min([1, 2, 3, 4]))
    print('max(1,2,3,4)', max([1, 2, 3, 4]))
    print('all([True, True, False])', all([True, True, False]))
    print('any([True, True, False])', any([True, True, False]))
    print('bool("String")', bool("String"))
    print('bool(false)', bool(False))
    print('hex(14)', hex(14))
    print('oct(14)', oct(14))
    print('bin(14)', bin(14))
    print('divmod(5,2)', divmod(5, 2))
    print('pow(2, 3)', pow(2, 3))
    print('pow(2, 3, 3)', pow(2, 3, 3))

    try:
        print('abs(None)', abs(None))  # known failure
    except TypeError:
        print("Error: Bad operand")

def main(argv):
    print('Use default')
    print(do_stuff(int(argv[1])))
    print('Use arg')
    print(do_stuff(1, int(argv[1])))
    print('Use kwarg')
    print(do_stuff(1, size=int(argv[1])))

    print('Make point')
    p = Point(2, 3)
    print('Distance with default is', p.distance())
    p = Point(3, 4, 5)
    print('Distance with arg is', p.distance())
    p = Point(4, 5, z=6)
    print('Distance with kwarg is', p.distance())
    print('hasattr(p, "x")', hasattr(p, "x"))  # expect true
    print('hasattr(p, "a")', hasattr(p, "a"))  # expect false
    print('delattr(p, "x")', delattr(p, "x"))
    print('hasattr(p, "x")', hasattr(p, "x"))  # now expect false

    print('Manipulate the DOM...')
    print('Open a new web page...')
    dom.window.open('http://pybee.org', '_blank')
    print('Set the page title')
    dom.document.title = 'Hello world'
    print('Find an element on the page...')
    div = dom.document.getElementById('pyconsole')
    print('... and set that element.')
    div.innerHTML = div.innerHTML + '\n\nHello, World!\n\n'

    print('Import a native module...')
    import native
    native.waggle(5)
    obj = native.MyClass(7)
    obj.doStuff(10)

    print('Try some builtins...')
    try_builtins()

    print('End of sample.py')
    return 0


if __name__ == '__main__':
    import sys
    main(sys.argv)
