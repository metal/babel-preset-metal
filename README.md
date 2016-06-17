babel-preset-metal
===================================

A babel preset for building Metal.js projects.

## Usage

This is a [babel preset](http://babeljs.io/docs/plugins/) that provides a default configuration for building Metal.js projects with babel, making sure to transpile ES2015 in a way that works from IE9 up. To use this, just add it to your package.json and pass it as a preset when calling babel:

```javascript
{
  "preset": ["metal"]
}
```
