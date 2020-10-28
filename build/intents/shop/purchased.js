'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PurchasedIntent = undefined;

var _consts = require('../../consts');

var _intents = require('../../consts/intents');

var PurchasedIntent = exports.PurchasedIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.PURCHASED_INTENT;
  },
  handle: function handle(handlerInput) {
    // check if user is eligible to play good word hunting
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, _consts.PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        var speechText = _consts.VOICE_OPEN + 'You have purchased the rights to play Good Word Hunting. ' + 'Would you like to play a quick game?' + _consts.VOICE_CLOSE;
        var repromptText = _consts.VOICE_OPEN + 'Would you like to play a game of Good Word Hunting?' + _consts.VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart'
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
      } else {
        var _speechText = _consts.VOICE_OPEN + 'You have not made any in-skill purchases.' + _consts.VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp'
        });
        return handlerInput.responseBuilder.speak(_speechText);
      }
    });
  }
};