'use strict';

var assert = require('assert');
var rewire = require('rewire');
var babel = require('babel-core');
var preset = rewire('../index');

module.exports = {
  testBowerDir: function(test) {
    var getBowerDir = preset.__get__('getBowerDir');
    assert.strictEqual(getBowerDir(), process.cwd() + '/bower_components');
    test.done();
  },

  testBowerImport: function(test) {
    var revert = preset.__set__({
      getBowerDir: function() {
        return '/path/to/bower';
      }
    });

    var code = 'import foo from "bower:bar/src/foo";\nimport bar from "bower:bar/src/bar";';
    var result = babel.transform(code, {presets: [preset], filename: '/path/to/bower/pkg/x/y/z/foo.js'});
    revert();

    assert.notStrictEqual(-1, result.code.indexOf('../../../../bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('../../../../bar/src/bar'));
    assert.strictEqual('../../../../bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('../../../../bar/src/bar', result.metadata.modules.imports[1].source);
    test.done();
  },

  testMissingSourceFilename: function(test) {
    var missing = 0;

    var revert = preset.__set__({
      getBowerDir: function() {
        return '/path/to/bower';
      },
      console: {
        warn: function(message) {
          if (message.indexOf('missing') !== -1) {
            missing += 1;
          }
        }
      }
    });

    var code = 'import foo from "bower:bar/src/foo";\nimport bar from "bower:bar/src/bar";';
    var result = babel.transform(code, {presets: [preset]});
    revert();

    assert.strictEqual(2, missing);
    assert.notStrictEqual(-1, result.code.indexOf('/path/to/bower/bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('/path/to/bower/bar/src/bar'));
    assert.strictEqual('/path/to/bower/bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('/path/to/bower/bar/src/bar', result.metadata.modules.imports[1].source);
    test.done();
  },

  testBowerImportFromFile: function(test) {
    var revert = preset.__set__({
      getBowerDir: function() {
        return __dirname + '/bower';
      }
    });

    var result = babel.transformFileSync(__dirname + '/fixtures/bower-import.js', {presets: [preset]});
    revert();

    assert.notStrictEqual(-1, result.code.indexOf('../bower/bar/src/foo'));
    assert.notStrictEqual(-1, result.code.indexOf('../bower/bar/src/bar'));
    assert.strictEqual('../bower/bar/src/foo', result.metadata.modules.imports[0].source);
    assert.strictEqual('../bower/bar/src/bar', result.metadata.modules.imports[1].source);
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
