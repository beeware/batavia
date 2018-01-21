
export default function input(prompt_text) {
    var user_input = prompt(prompt_text) // eslint-disable-line no-undef
    return user_input
}

input.__name__ = 'input'
input.__doc__ = `input([prompt]) -> string

Read a string from standard input.  The trailing newline is stripped.
If the user hits EOF (Unix: Ctl-D, Windows: Ctl-Z+Return), raise EOFError.
On Unix, GNU readline is used if enabled.  The prompt string, if given,
is printed without a trailing newline before reading.`
input.$pyargs = {
    default_args: ['prompt']
}
