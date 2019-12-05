const JasmineCore = require('jasmine-core')

// @ts-ignore
global.getJasmineRequireObj = () => {
  return JasmineCore
}

require('jasmine-ajax')
