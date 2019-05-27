def remove_whitespace(text, indent=False):
    lines = text.split('\n')

    if lines[0].strip() == '':
        lines = lines[1:]
    first_line = lines[0].lstrip()
    n_spaces = len(lines[0]) - len(first_line)

    return [('    ' if indent and line[n_spaces:] else '') + line[n_spaces:] for line in lines]


def wrap_in_function(code_to_wrap):
    return '\n'.join(
        ["def test_function():"]
        + remove_whitespace(code_to_wrap, indent=True)
        + ["test_function()"])


def wrap_in_exception_guard(code_to_wrap):
    return '\n'.join(
        ["try:"]
        + remove_whitespace(code_to_wrap, indent=True)
        + ["except Exception as e:",
           "    print(\"Exception escaped test code in TEST_RUNNER_TARGET\")",
           "    print(repr(e))"])


def adjust(code_snippet, run_in_function=False, wrap_in_try_catch=False):
    """Adjust a code sample to remove leading whitespace and add wrapping code."""

    if run_in_function:
        code_snippet = wrap_in_function(code_snippet)

    if wrap_in_try_catch:
        return wrap_in_exception_guard(code_snippet)

    return '\n'.join(remove_whitespace(code_snippet))
