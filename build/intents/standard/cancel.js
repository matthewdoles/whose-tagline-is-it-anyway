'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancelIntent = undefined;

var _intents = require('../../consts/intents');

var CancelIntent = exports.CancelIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.CANCEL_INTENT;
  },
  handle: function handle(handlerInput) {
    // cancel intent, exit skill
    return handlerInput.responseBuilder.speak();
  }
};