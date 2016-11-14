/*
 * Javascript DOM module.
 *
 * This is a wrapper to allow Python code to access DOM objects and methods.
 */

module.exports = {
    'dom': {
        'window': window,
        'parent': parent,
        'top': top,
        'navigator': navigator,
        'frames': frames,
        'location': location,
        'history': history,
        'document': document,
        'batavia': batavia
    }
}
