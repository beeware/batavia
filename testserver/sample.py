import other


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance(self):
        return self.x ** 2 + self.y ** 2


def do_stuff(count):
    for i in range(0, count):
        print("HELLO", i)
        other.wiggle(i)


def main(argv):
    print(do_stuff(int(argv[1])))
    p = Point(2, 3)
    print('Distance is', p.distance())
    return 0


def target(*args):
    return main, None


if __name__ == '__main__':
    import sys
    main(sys.argv)
