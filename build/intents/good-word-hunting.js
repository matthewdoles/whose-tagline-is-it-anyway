'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoodWordHuntingIntent = undefined;

var _intents = require('../consts/intents');

var _consts = require('../consts/');

var GoodWordHuntingIntent = exports.GoodWordHuntingIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.GOOD_WORD_HUNTING;
  },
  handle: function handle(handlerInput) {
    // ensure user is eligible to play good word hunting
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, _consts.PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        var responseText = _consts.VOICE_OPEN + 'Would you like to play Good Word Hunting with extended time?</voice>' + _consts.VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart'
        });
        return handlerInput.responseBuilder.speak(responseText).reprompt(responseText).getResponse();
      } else {
        // user not eligible to play, ask if they would like to hear game description
        var helpText = 'Would you like to hear a little bit about this game?';
        var _responseText = _consts.VOICE_OPEN + "Sorry, it seems you haven't purchased the rights to play Good Word Hunting. " + helpText + _consts.VOICE_CLOSE;

        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp'
        });
        return handlerInput.responseBuilder.speak(_responseText).reprompt(helpText).getResponse();
      }
    });
  }
};