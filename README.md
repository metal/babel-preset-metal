babel-preset-metal
===================================

A babel preset for building Metal.js projects.

## Usage

This is a [babel preset](http://babeljs.io/docs/plugins/) that includes some helpers for building Metal.js projects. Even though all of them are optional, still they're useful. To use it, just add it to your package.json and pass it as a preset when calling babel:

```javascript
{
  "preset": ["metal"]
}
```

## Included plugins

* [babel-plugin-metal-register-components](https://github.com/mairatma/babel-plugin-metal-register-components)
* [babel-plugin-import-alias-bower](https://github.com/mairatma/babel-plugin-import-alias-bower)
