
export default function input(prompt_text) {
    var user_input = prompt(prompt_text) // eslint-disable-line no-undef
    return user_input
}

input.__doc__ = 'input([prompt]) -> string\n\nRead a string from standard input.  The trailing newline is stripped.\nIf the user hits EOF (Unix: Ctl-D, Windows: Ctl-Z+Return), raise EOFError.\nOn Unix, GNU readline is used if enabled.  The prompt string, if given,\nis printed without a trailing newline before reading.'
input.$pyargs = {
    default_args: ['prompt']
}
