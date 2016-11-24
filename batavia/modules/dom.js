/*
 * Javascript DOM module.
 *
 * This is a wrapper to allow Python code to access DOM objects and methods.
 */

module.exports = {
    'window': typeof window !== 'undefined' ? window : {},
    'parent': typeof window !== 'undefined' ? parent : {},
    'top': typeof window !== 'undefined' ? top : {},
    'navigator': typeof window !== 'undefined' ? navigator : {},
    'frames': typeof window !== 'undefined' ? frames : {},
    'location': typeof window !== 'undefined' ? location : {},
    'history': typeof window !== 'undefined' ? history : {},
    'document': typeof window !== 'undefined' ? document : {}
}
