'use strict';

var bowerDirectory = require('bower-directory');
var path = require('path');

var bowerDirCache;

/**
 * This function returns the same value as `bowerDirectory.sync()`, but
 * caches it for future calls, instead of recalculating the bower directory
 * path each time like the original function does.
 * @return {string}
 */
function getBowerDir() {
  if (!bowerDirCache) {
    bowerDirCache = bowerDirectory.sync();
  }
  return bowerDirCache;
}

function renameAlias(originalPath) {
  var result = originalPath;
  if (originalPath.substr(0, 6) === 'bower:') {
    result = path.join(getBowerDir(), originalPath.substr(6));
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
