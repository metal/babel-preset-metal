'use strict';

var assert = require('assert');
var babel = require('babel-core');
var bowerDirectory = require('bower-directory');
var preset = require('../index');
var sinon = require('sinon');

module.exports = {
  testBowerImport: function(test) {
    sinon.stub(bowerDirectory, 'sync').returns('/path/to/bower');
    var code = 'import foo from "bower:bar/src/foo";';
    var result = babel.transform(code, {presets: [preset]});

    var expected = 'import foo from "/path/to/bower/bar/src/foo";';
    assert.strictEqual(expected, result.code);
    bowerDirectory.sync.restore();
    test.done();
  },

  testComponentRegistration: function(test) {
    var code = 'class Foo extends Bar {}\nexport default Foo;';
    var result = babel.transform(code, {presets: [preset]});
    assert.notStrictEqual(-1, result.code.indexOf('Foo.prototype.registerMetalComponent'));
    test.done();
  }
};
