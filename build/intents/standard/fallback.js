'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    VOICE_OPEN = _require.VOICE_OPEN,
    VOICE_CLOSE = _require.VOICE_CLOSE;

var _require2 = require('../../consts/intents'),
    FALLBACK_INTENT = _require2.FALLBACK_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var Fallback = exports.Fallback = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === FALLBACK_INTENT;
  },
  handle: function handle(handlerInput) {
    var reponseText = VOICE_OPEN + "Sorry, I didn't understand what you said. Please try again." + VOICE_CLOSE;

    return handlerInput.responseBuilder.speak(reponseText).reprompt(reponseText).getResponse();
  }
};