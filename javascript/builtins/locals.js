
export default function locals() {
    return this.frame.f_locals
}

locals.__doc__ = "locals() -> dictionary\n\nUpdate and return a dictionary containing the current scope's local variables."
locals.$pyargs = true
