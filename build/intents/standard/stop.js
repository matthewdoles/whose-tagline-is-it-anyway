'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StopIntent = undefined;

var _intents = require('../../consts/intents');

var StopIntent = exports.StopIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.STOP_INTENT;
  },
  handle: function handle(handlerInput) {
    // stop intent, exit skill
    return handlerInput.responseBuilder.speak();
  }
};