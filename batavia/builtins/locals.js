const exceptions = require('../core.js').exceptions
function locals(args) {
    if( !args || args.length==0){
        //noargs is  true 
        return this.frame.f_locals
    }
    //noargs is false
    throw new exceptions.TypeError.$pyclass("locals() takes no arguments (1 given)") 
}
locals.__doc__ = "locals() -> dictionary\n\nUpdate and return a dictionary containing the current scope's local variables."

module.exports = locals
