import json from 'rollup-plugin-json'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'javascript/batavia.js',
  output: {
    file: 'batavia/static/batavia.js',
    format: 'umd',
    name: 'batavia',
    sourcemap: true
  },
  plugins: [
    json(),
    globals(),
    builtins(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    babel(),
    uglify()
  ]
};
