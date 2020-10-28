'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnhandledHandler = undefined;

var _consts = require('../consts');

var UnhandledHandler = exports.UnhandledHandler = {
  canHandle: function canHandle() {
    return true;
  },
  handle: function handle(handlerInput, error) {
    return handlerInput.responseBuilder.speak(_consts.VOICE_OPEN + 'Sorry, I am not quite sure what to do.' + _consts.VOICE_CLOSE).getResponse();
  }
};