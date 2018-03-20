import { pyNotImplementedError } from '../core/exceptions'

export var webbrowser = {
    __doc__: '',
    __file__: 'batavia/modules/webbrowser.js',
    __name__: 'webbrowser',
    __package__: ''
}

webbrowser.open = function(url) {
    window.location = url
}

webbrowser.open_new = function(url) {
    window.open(url)
}

// no differentiation inside browser
webbrowser.open_new_tab = webbrowser.open_new

webbrowser.get = function(name) {
    throw pyNotImplementedError('Multiple web browsers not supported in DOM-embedded webbrowser module; only the host browser.')
}

webbrowser.register = function(name, constructor) {
    throw pyNotImplementedError('Multiple web browsers not supported in DOM-embedded webbrowser module; only the host browser.')
}
