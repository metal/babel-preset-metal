'use strict';

var assert = require('assert');
var babel = require('babel-core');
var util = require('../util');
var preset = require('../index');
var sinon = require('sinon');

module.exports = {
  testBowerDir: function(test) {
    assert.strictEqual(util.getBowerDir({cwd: '/foo/bah'}), '/foo/bah/bower_components');
    test.done();
  },

  testBowerImport: function(test) {
    sinon.stub(util, 'getBowerDir').returns('/path/to/bower');
    var code = 'import foo from "bower:bar/src/foo";\nimport bar from "bower:bar/src/bar";';
    var result = babel.transform(code, {presets: [preset]});

    assert.notStrictEqual(-1, result.code.indexOf('/path/to/bower/bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('/path/to/bower/bar/src/bar'));
    assert.strictEqual('/path/to/bower/bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('/path/to/bower/bar/src/bar', result.metadata.modules.imports[1].source);
    util.getBowerDir.restore();
    test.done();
  },

  testBowerImportFromFile: function(test) {
    sinon.stub(util, 'getBowerDir').returns(__dirname + '/bower');
    var result = babel.transformFileSync(__dirname + '/fixtures/bower-import.js', {presets: [preset]});

    assert.notStrictEqual(-1, result.code.indexOf('../bower/bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('../bower/bar/src/bar'));
    assert.strictEqual('../bower/bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('../bower/bar/src/bar', result.metadata.modules.imports[1].source);
    util.getBowerDir.restore();
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
