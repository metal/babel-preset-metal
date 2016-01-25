'use strict';

var path = require('path');

function renameAlias(originalPath, filename) {
  var result = originalPath;
  if (originalPath.substr(0, 4) === 'npm:') {
    var dir = path.resolve('node_modules');

    // babel uses 'unknown' as a special value for filename when the transformed
    // source can't be traced to a file (e.g., transformed string)
    // https://github.com/babel/babel/blob/d2e7e6a/packages/babel-core/src/transformation/file/options/config.js
    if (filename && filename !== 'unknown') {
      dir = path.relative(path.dirname(filename), dir);
    }
    else {
      console.warn('Warning: missing source path leads to wrong / absolute import path.');
    }

    result = path.join(dir, originalPath.substr(4));
  }
  return result.replace(/\\/g, '/');
}

module.exports = {
  resolveModuleSource: renameAlias,
  plugins: [
    require('babel-plugin-metal-register-components'),

    // Temporary hack that fixes constructor problems for IE <= 10.
    // See https://phabricator.babeljs.io/T3041 for more details.
    // TODO: Remove this was the issue is fixed.
    [require('babel-plugin-transform-es2015-classes'), {loose: true}]
  ],
  presets: [
    require('babel-preset-es2015')
  ]
};
