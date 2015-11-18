'use strict';

module.exports = {
  plugins: [
    require('babel-plugin-metal-register-components'),
    require('babel-plugin-import-alias-bower')
  ],
  presets: [
    require('babel-preset-es2015')
  ]
};
