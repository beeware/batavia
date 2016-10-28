External JavaScript Dependencies
================================

External JavaScript dependencies live in the `batavia.vendored` namespace. 

The `batavia/vendor/requirements.js` file contains a list of the currently
available dependencies. Batavia developers consuming already vendored
dependencies don't need to know anything else or install extra tools.

The code for the vendored dependencies is bundled in the
`batavia/vendor/vendored.js` file. Batavia packagers don't need to know anything
else or install extra tools.

The following information is for developers who need to add a new external JS
library as a Batavia dependency.


Vendoring of External JS Dependencies
-------------------------------------

External JS dependencies are vendored into the batavia repo using the following
standard JavaScript workflow tools:

  - `Node.js`: an implementation of the JavaScript language.
  - `yarn`: a package manager for `npm` packages. `npm` is the name for both a
     package manager and a package repositry, the JS equivalent of both `pip`
     and `PyPi` in the Python world. For Batavia, we'll use the `npm` package
     repository to get code from, but we'll be using `yarn` as our package
     manager to get it with.
  - `browserify`: a bundler that packages modules from `npm` (made to run on
     Node.js) so they can be run in a browser.

Batavia developers adding new dependencies to the code tree will need to edit
`requirements.js` by hand, and use the above tools to make a new pair of
`package.json` and `batavia/vendor/vendored.js` files.

Installing the dependency vendoring tools
-----------------------------------------

Here's how to install the vendoring toolchain:

  1. Install Node.js using the [instructions for your platform](https://nodejs.org/en/download/package-manager/).
     This will also install the `npm` package manager, which we'll use
     to bootstrap the rest of the installation.
  1. Install the Yarn package manager with `npm install -g yarn`. This installs it
     globally, so you will need to use `sudo` on unixy platforms like Ubuntu or
     MacOS: `sudo npm install -g yarn`
  1. Install browserify with `yarn global add browserify`. As above, use
     `sudo yarn global add browserify` on unix-like platforms.

Adding a new dependency to Batavia
----------------------------------

In this example, we're going to add a new dependency: the `bignumber.js` library.

1. From the root of your Batavia project: `cd batavia/vendoring`
1. Find the right name for the library! This is as true for JavaScript as it is
   for Python. In the present case, there are several libraries with similar names,
   and we want the one registered on npm as `bignumber.js`, not `big-number` nor `bignumber`.
1. Download the library and add it to the `package.json` manifest with `yarn add <libraryname>`
   (in this case, we'll run `yarn add bignumber.js`).
1. Add the desired exported item to the `module.exports` object in the `dependencies.js`
   file. Since `bignumber.js` only exports the constructor function `BigNumber`, this is
   the key/value pair we'll add: `BigNumber: require('bignumber.js')`.
1. Optionally, some libraries require configuration. You may apply it in the `vendored_config.js` file.
1. Run the vendoring script with `yarn run vendor`. If you have errors, check
   that your JSON is correct (for instance, the last item in a JS object can't
   have a trailing comma) and that browserify is installed).
1. Add the following in a single commit:
   - The `package.json`, `requirements.js` and `vendored.js` (and `vendored_config.js`) files.
   - The `node_modules` directory containing the newly added dependencies.

At this point, everyone will be able to use this new library as
`batavia.vendored.<libraryname>`. In this case the name is `batavia.vendored.BigNumber`.

Other libraries export more than one function or property. For those, we use an intermediate
namespace, as is the case with `batavia.vendored.buffer.Buffer`.
