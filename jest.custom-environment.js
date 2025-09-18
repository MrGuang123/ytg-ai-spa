const JSDOMEnvironment = require('jest-environment-jsdom').default;

// A custom environment that extends JSDOM and adds TextEncoder/TextDecoder.
// This is necessary to polyfill these APIs for libraries like react-router-dom.
module.exports = class CustomJSDOMEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util');
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
};
