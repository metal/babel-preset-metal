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

function renameAlias(originalPath, parentPath) {
  var result = originalPath;
  if (originalPath[0] === '.') {
    result = path.resolve(path.dirname(parentPath), originalPath);
  } else if (originalPath.substr(0, 6) === 'bower:') {
    result = path.join(getBowerDir(), originalPath.substr(6));
  }
  return result.replace(/\\/g, '/');
}

module.exports = {
  resolveModuleSource: renameAlias,
  plugins: [
    require('babel-plugin-metal-register-components')
  ],
  presets: [
    require('babel-preset-es2015')
  ]
};
