'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var UnhandledHandler = exports.UnhandledHandler = {
  canHandle: function canHandle() {
    return true;
  },
  handle: function handle(handlerInput, error) {
    return handlerInput.responseBuilder.speak(VOICE_OPEN + 'Sorry, I am not quite sure what to do.' + VOICE_CLOSE).getResponse();
  }
};