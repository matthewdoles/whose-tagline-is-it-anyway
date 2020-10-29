'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts/intents'),
    INTENT_REQUEST = _require.INTENT_REQUEST,
    STOP_INTENT = _require.STOP_INTENT;

var StopIntent = exports.StopIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === STOP_INTENT;
  },
  handle: function handle(handlerInput) {
    // stop intent, exit skill
    return handlerInput.responseBuilder.speak();
  }
};