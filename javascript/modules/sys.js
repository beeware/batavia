import { pyargs } from '../core/callables'

export var sys = {
    '__doc__': '',
    '__file__': 'batavia/modules/sys.js',
    '__name__': 'sys',
    '__package__': '',

    'modules': {}
}

// A buffer class
var IOBuffer = class IOBuffer {
    constructor(console) {
        this.buf = ''
        this.console = console
    }

    @pyargs({
        args: ['text']
    })
    write(text) {
        var lines = text.split('\n')

        if (lines.length === 1) {
            // If there's only one element in the split,
            // there were no newlines. Accumulate a buffer.
            this.buf += lines
        } else if (lines.length > 1) {
            // Flush everything in the buffer, and then everything
            // up to the first newline.
            this.console.log(this.buf + lines[0])

            for (var i = 1; i < lines.length - 1; i++) {
                this.console.log(lines[i])
            }

            // If the line ends with a newline, the last element in
            // `lines` will be empty.
            // If there is content in the last line, it means there
            // is no newline at the end of the content, so there's
            // no flush; this content becomes the accumulated buffer.
            this.buf = lines[lines.length - 1]
        }
    }

    flush() {
        if (this.buf) {
            this.console.log(this.buf)
            this.buf = ''
        }
    }
}

// Define an instance of the buffer that works on the console.
var console_output = new IOBuffer(console)

// Export the console IOBuffer instance as sys.stdout/stderr
// sys.stdin = io.stdin
sys.stdout = console_output
sys.stderr = console_output
