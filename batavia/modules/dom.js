/*
 * Javascript DOM module.
 *
 * This is a wrapper to allow Python code to access DOM objects and methods.
 */

module.exports = {
    'window': typeof window !== 'undefined' ? window : {},
    'parent': typeof parent !== 'undefined' ? parent : {},
    'top': typeof top !== 'undefined' ? top : {},
    'navigator': typeof navigator !== 'undefined' ? navigator : {},
    'frames': typeof frames !== 'undefined' ? frames : {},
    'location': typeof location !== 'undefined' ? location : {},
    'history': typeof history !== 'undefined' ? history : {},
    'document': typeof document !== 'undefined' ? document : {}
}
