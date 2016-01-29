'use strict';

var path = require('path');

function getConfig(moduleName) {
  try {
    return require(path.join(moduleName, 'package.json'));
  } catch (e) {
    return {};
  }
}

function getFullPath(originalPath) {
  var fullPath = originalPath;
  if (path.dirname(originalPath) === '.') {
    // There are no subfolders, so node will try to use file specified by There
    // "main" key in the package.json. We need the browser version though, so
    // let's lookup the "browser" key instead.
    var config = getConfig(originalPath);
    if (config.browser) {
      fullPath = path.join(originalPath, config.browser);
    }
  }
  return getModulePath(fullPath);
}

function getModulePath(name) {
  try {
    return require.resolve(name);
  } catch (e) {
    // If a module wasn't found with this name, just return the original path.
    return name;
  }
}

function renameAlias(originalPath, filename) {
  var result = originalPath;
  if (originalPath[0] !== '.' && originalPath[0] !== '/' && originalPath.indexOf(':') === -1) {
    var fullPath = getFullPath(originalPath);
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
