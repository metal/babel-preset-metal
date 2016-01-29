'use strict';

var fs = require('fs');
var path = require('path');

var existsCache = {};
function checkFileExists(filename) {
  if (!existsCache[filename]) {
    existsCache[filename] = fs.existsSync(filename);
  }
  return existsCache[filename];
}

/**
 * If node would get the file from "lib" folder, look for it in the "src" folder
 * instead, since we want the original ES6 file, not compiled to Common JS.
 */
function getSrcFile(originalPath, filename) {
  var libPath = path.join(originalPath, 'lib');
  var srcFile = filename.replace(libPath, path.join(originalPath, 'src'));
  if (srcFile !== filename && checkFileExists(srcFile)) {
    return srcFile;
  }
  return filename;
}

function renameAlias(originalPath, filename) {
  var result = originalPath;
  if (originalPath[0] !== '.' && originalPath[0] !== '/' && originalPath.indexOf(':') === -1) {
    var fullPath = getSrcFile(originalPath, require.resolve(originalPath));
    result = path.join(path.dirname(fullPath), path.basename(fullPath, '.js'));

    // babel uses 'unknown' as a special value for filename when the transformed
    // source can't be traced to a file (e.g., transformed string)
    // https://github.com/babel/babel/blob/d2e7e6a/packages/babel-core/src/transformation/file/options/config.js
    if (filename && filename !== 'unknown') {
      result = path.relative(path.dirname(filename), result);
    }
    else {
      console.warn('Warning: missing source path leads to wrong / absolute import path.');
    }
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
