'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../../consts/intents'),
    INTENT_REQUEST = _require2.INTENT_REQUEST,
    SHOP_INTENT = _require2.SHOP_INTENT;

var ShopIntent = exports.ShopIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === SHOP_INTENT;
  },
  handle: function handle(handlerInput) {
    var repromptText = "For more information please say, 'what is Good Word Hunting'.";

    return handlerInput.responseBuilder.speak(VOICE_OPEN + 'If you enjoyed playing Whose Tagline Is It Anyway, ' + 'you may also be interested in Good Word Hunting.' + repromptText + VOICE_CLOSE).reprompt(VOICE_OPEN + repromptText + VOICE_CLOSE).getResponse();
  }
};