'use strict';

var assert = require('assert');
var babel = require('babel-core');
var bowerDirectory = require('bower-directory');
var preset = require('../index');
var sinon = require('sinon');

module.exports = {
  testBowerImport: function(test) {
    sinon.stub(bowerDirectory, 'sync').returns('/path/to/bower');
    var code = 'import foo from "bower:bar/src/foo";\nimport bar from "bower:bar/src/bar";';
    var result = babel.transform(code, {presets: [preset]});

    assert.notStrictEqual(-1, result.code.indexOf('/path/to/bower/bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('/path/to/bower/bar/src/bar'));
    assert.strictEqual('/path/to/bower/bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('/path/to/bower/bar/src/bar', result.metadata.modules.imports[1].source);
    bowerDirectory.sync.restore();
    test.done();
  },

  testNotBowerImport: function(test) {
    var code = 'import foo from "../src/foo";';
    var result = babel.transform(code, {presets: [preset]});

    assert.notStrictEqual(-1, result.code.indexOf('../src/foo'));
    assert.strictEqual('../src/foo', result.metadata.modules.imports[0].source);
    test.done();
  },

  testComponentRegistration: function(test) {
    var code = 'class Foo extends Bar {}\nexport default Foo;';
    var result = babel.transform(code, {presets: [preset]});
    assert.notStrictEqual(-1, result.code.indexOf('Foo.prototype.registerMetalComponent'));
    test.done();
  },

  testEs2015: function(test) {
    var code = 'class Foo extends Bar {}\nexport default Foo;';
    var result = babel.transform(code, {presets: [preset]});
    assert.strictEqual(-1, result.code.indexOf('class Foo'));
    test.done();
  }
};
