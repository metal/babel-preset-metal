'use strict';

module.exports = {
  plugins: [
    // Temporary hack that fixes constructor problems for IE <= 10.
    // See https://phabricator.babeljs.io/T3041 for more details.
    // TODO: Remove this was the issue is fixed.
    [require('babel-plugin-transform-es2015-classes'), {loose: true}]
  ],
  presets: [
    require('babel-preset-es2015')
  ]
};
