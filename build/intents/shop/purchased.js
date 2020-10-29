'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    PRODUCT_ID = _require.PRODUCT_ID,
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../../consts/intents'),
    INTENT_REQUEST = _require2.INTENT_REQUEST,
    PURCHASED_INTENT = _require2.PURCHASED_INTENT;

var PurchasedIntent = exports.PurchasedIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === PURCHASED_INTENT;
  },
  handle: function handle(handlerInput) {
    // check if user is eligible to play good word hunting
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        var speechText = VOICE_OPEN + 'You have purchased the rights to play Good Word Hunting. ' + 'Would you like to play a quick game?' + VOICE_CLOSE;
        var repromptText = VOICE_OPEN + 'Would you like to play a game of Good Word Hunting?' + VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart'
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
      } else {
        var _speechText = VOICE_OPEN + 'You have not made any in-skill purchases.' + VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp'
        });
        return handlerInput.responseBuilder.speak(_speechText);
      }
    });
  }
};