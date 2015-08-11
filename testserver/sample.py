import other


def do_stuff(count):
    for i in range(0, count):
        print("HELLO", i)
        other.wiggle(i)


def main(argv):
    print(do_stuff(int(argv[1])))
    return 0


def target(*args):
    return main, None


if __name__ == '__main__':
    import sys
    main(sys.argv)
