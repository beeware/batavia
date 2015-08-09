"""Execute files of Python code."""

# import marshal

# from .pyvm2 import VirtualMachine

# cdef extern void run_bytecode(bytecode, globals):
#     if globals is None:
#         globals = {}

#     code = marshal.unmarshal(base64.decodebytes(bytecode.encode('utf8')))
#     vm = VirtualMachine()
#     vm.run_code(code, f_globals=globals)

cdef api int do_stuff(message):
    total = 0
    for i in range(0, 10):
        print message
        total = total + i

    return total
