#!/usr/bin/env python3



with open('ast/graminit.c') as fin:
    text = fin.read()

lines = [l.strip() for l in text.strip().split('\n') if l.strip()]

processing = None
out = ''

for line in lines:
    if line.startswith('/*') or line.startswith('//'):
        continue
    if line.startswith('#'):
        continue
    if line.startswith('PyAPI_DATA(grammar)'):
        # ignore grammar declaration
        continue
    if line.startswith('static '):
        pieces = line.split(' ')
        processing = pieces[1]
        name = pieces[2].split('[')[0]
        out += 'var %s = [' % name
        continue

    if processing == 'arc':
        if not line.startswith('{') or not line.endswith('},'):
            processing = None
            out = out[:-1]
            out += '];\n'
            continue
        else:
            out += 'new Arc(' + repr([int(x) for x in line[1:-2].split(', ')]) + '),'
        continue
    if processing == 'state':
        if not line.startswith('{') or not line.endswith('},'):
            processing = None
            out = out[:-1]
            out += '];\n'
            continue
        else:
            a, b = line[1:-2].split(', ')
            out += 'new State(%s),' % b
        continue
    if processing == 'dfa':
        if line.startswith('{'):
            a, b, c, d, e = line[1:-1].split(', ')
            out += 'new DFA(%d, %s, %d, %s,' % (int(a), repr(b), int(c), e)
            continue
        elif line.endswith('},'):
            out += '%s),' % (line[:-2])
            continue
        elif line.endswith('};'):
            processing = None
            out = out[:-1]
            out += '];\n'
            continue
    if processing == 'label':
        if not line.startswith('{') or not line.endswith('},'):
            processing = None
            out = out[:-1]
            out += '];\n'
            continue
        else:
            a, b = line[1:-2].split(', ')
            out += 'new Label(%d, %s),' % (int(a), b)
        continue
    if line.startswith('grammar '):
        # finish
        out += '\nvar _PyParser_Grammar = new Grammar(dfas, labels);\n';
        break
    assert False # shouldn't be able to reach here
print(out)
