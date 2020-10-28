'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fallback = undefined;

var _consts = require('../../consts');

var _intents = require('../../consts/intents');

var Fallback = exports.Fallback = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.FALLBACK_INTENT;
  },
  handle: function handle(handlerInput) {
    var reponseText = _consts.VOICE_OPEN + "Sorry, I didn't understand what you said. Please try again." + _consts.VOICE_CLOSE;

    return handlerInput.responseBuilder.speak(reponseText).reprompt(reponseText).getResponse();
  }
};