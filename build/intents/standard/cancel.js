'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts/intents'),
    CANCEL_INTENT = _require.CANCEL_INTENT,
    INTENT_REQUEST = _require.INTENT_REQUEST;

var CancelIntent = exports.CancelIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === CANCEL_INTENT;
  },
  handle: function handle(handlerInput) {
    // cancel intent, exit skill
    return handlerInput.responseBuilder.speak();
  }
};