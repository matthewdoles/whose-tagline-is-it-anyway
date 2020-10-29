'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts/intents'),
    GOOD_WORD_HUNTING_INTENT = _require.GOOD_WORD_HUNTING_INTENT,
    INTENT_REQUEST = _require.INTENT_REQUEST;

var _require2 = require('../consts'),
    PRODUCT_ID = _require2.PRODUCT_ID,
    VOICE_CLOSE = _require2.VOICE_CLOSE,
    VOICE_OPEN = _require2.VOICE_OPEN;

var GoodWordHuntingIntent = exports.GoodWordHuntingIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === GOOD_WORD_HUNTING_INTENT;
  },
  handle: function handle(handlerInput) {
    // ensure user is eligible to play good word hunting
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        var responseText = VOICE_OPEN + 'Would you like to play Good Word Hunting with extended time?' + VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart'
        });
        return handlerInput.responseBuilder.speak(responseText).reprompt(responseText).getResponse();
      } else {
        // user not eligible to play, ask if they would like to hear game description
        var helpText = 'Would you like to hear a little bit about this game?';
        var _responseText = VOICE_OPEN + "Sorry, it seems you haven't purchased the rights to play Good Word Hunting. " + helpText + VOICE_CLOSE;

        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp'
        });
        return handlerInput.responseBuilder.speak(_responseText).reprompt(helpText).getResponse();
      }
    });
  }
};