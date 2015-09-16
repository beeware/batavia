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
    print('abs(-1)', abs(-1))
    print('abs(None)', abs(None))


def main(argv):
    print('Use default')
    print(do_stuff(int(argv[1])))
    print('Use arg')
    print(do_stuff(1, int(argv[1])))
    print('Use kwarg')
    print(do_stuff(1, size=int(argv[1])))
    p = Point(2, 3)
    print('Distance with default is', p.distance())
    p = Point(3, 4, 5)
    print('Distance with arg is', p.distance())
    p = Point(4, 5, z=6)
    print('Distance with kwarg is', p.distance())
    print('Manipulate the DOM...')
    print('Open a new web page...')
    dom.window.open('http://pybee.org', '_blank')
    print('Set the page title')
    dom.document.title = 'Hello world'
    print('Find an element on the page...')
    div = dom.document.getElementById('stdout')
    print('... and set of that element.')
    div.innerHTML = div.innerHTML + '\n\nHello, World!\n\n'
    print('Try some builtins...')
    try_builtins()
    return 0


if __name__ == '__main__':
    import sys
    main(sys.argv)
