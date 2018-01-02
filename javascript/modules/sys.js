
export var sys = {
    '__doc__': '',
    '__file__': 'batavia/modules/sys.js',
    '__name__': 'sys',
    '__package__': '',

    'modules': {}
}

// A buffer class
var IOBuffer = function(con) {
    this.buf = ''
    this.console = con
}

IOBuffer.prototype.write = function(args, kwargs) {
    var lines = args[0].split('\n')

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
IOBuffer.prototype.write.$pyargs = true

IOBuffer.prototype.flush = function(args, kwargs) {
    if (this.buf) {
        this.console.log(this.buf)
        this.buf = ''
    }
}
IOBuffer.prototype.flush.$pyargs = true

// Define an instance of the buffer that works on the console.
var console_output = new IOBuffer(console)

// sys.stdin = io.stdin
sys.stdout = console_output
sys.stderr = console_output
