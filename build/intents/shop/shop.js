'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShopIntent = undefined;

var _consts = require('../../consts');

var _intents = require('../../consts/intents');

var ShopIntent = exports.ShopIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.SHOP_INTENT;
  },
  handle: function handle(handlerInput) {
    var repromptText = "For more information please say, 'what is Good Word Hunting'.";

    return handlerInput.responseBuilder.speak(_consts.VOICE_OPEN + 'If you enjoyed playing Whose Tagline Is It Anyway, ' + 'you may also be interested in Good Word Hunting.' + repromptText + _consts.VOICE_CLOSE).reprompt(_consts.VOICE_OPEN + repromptText + _consts.VOICE_CLOSE).getResponse();
  }
};