'use strict';

var assert = require('assert');
var babel = require('babel-core');
var bowerDirectory = require('bower-directory');
var plugin = require('../index');
var sinon = require('sinon');

module.exports = {
  setUp: function(done) {
    sinon.stub(bowerDirectory, 'sync').returns('/path/to/bower');
    done();
  },

  tearDown: function(done) {
    bowerDirectory.sync.restore();
    done();
  },

  testBowerImport: function(test) {
    var code = 'import foo from "bower:bar/src/foo";';
    var result = babel.transform(code, {plugins: [plugin]});

    var expected = 'import foo from "/path/to/bower/bar/src/foo";';
    assert.strictEqual(expected, result.code);
    test.done();
  }
};
