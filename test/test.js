'use strict';

var assert = require('assert');
var babel = require('babel-core');
var path = require('path');
var preset = require('../index');
var sinon = require('sinon');

module.exports = {
  setUp: function(done) {
    sinon.stub(console, 'warn');
    done();
  },

  tearDown: function(done) {
    console.warn.restore();
    done();
  },

  testNpmImport: function(test) {
    var code = 'import foo from "bar/src/foo";\nimport bar from "bar/src/bar";';
    var result = babel.transform(code, {presets: [preset], filename: path.resolve('src/x/y/z/foo.js')});

    assert.notStrictEqual(-1, result.code.indexOf('../../../../node_modules/bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('../../../../node_modules/bar/src/bar'));
    assert.strictEqual('../../../../node_modules/bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('../../../../node_modules/bar/src/bar', result.metadata.modules.imports[1].source);
    test.done();
  },

  testNpmImportMissingSourceFilename: function(test) {
    var code = 'import foo from "bar/src/foo";\nimport bar from "bar/src/bar";';
    var result = babel.transform(code, {presets: [preset]});

    assert.strictEqual(2, console.warn.callCount);
    assert.notStrictEqual(-1, result.code.indexOf(path.resolve('node_modules', '/bar/src/foo')));
    assert.notStrictEqual(-1, result.code.indexOf(path.resolve('node_modules', '/bar/src/bar')));
    assert.strictEqual(path.resolve('node_modules', 'bar/src/foo'), result.metadata.modules.imports[0].source);
    assert.strictEqual(path.resolve('node_modules', 'bar/src/bar'), result.metadata.modules.imports[1].source);

    test.done();
  },

  testNpmImportFromFile: function(test) {
    var result = babel.transformFileSync(__dirname + '/fixtures/npm-import.js', {presets: [preset]});

    assert.notStrictEqual(-1, result.code.indexOf('../../node_modules/bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('../../node_modules/bar/src/bar'));
    assert.strictEqual('../../node_modules/bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('../../node_modules/bar/src/bar', result.metadata.modules.imports[1].source);
    test.done();
  },

  testNotNpmRelativeImport: function(test) {
    var code = 'import foo from "../src/foo";';
    var result = babel.transform(code, {presets: [preset]});

    assert.notStrictEqual(-1, result.code.indexOf('../src/foo'));
    assert.strictEqual('../src/foo', result.metadata.modules.imports[0].source);
    test.done();
  },

  testNotNpmPrefixImport: function(test) {
    var code = 'import foo from "bower:bar/src/foo";';
    var result = babel.transform(code, {presets: [preset]});

    assert.notStrictEqual(-1, result.code.indexOf('bower:bar/src/foo'));
    assert.strictEqual('bower:bar/src/foo', result.metadata.modules.imports[0].source);
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
