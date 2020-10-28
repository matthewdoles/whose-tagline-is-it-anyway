'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LaunchRequestHandler = undefined;

var _consts = require('../consts');

var LaunchRequestHandler = exports.LaunchRequestHandler = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle: function handle(handlerInput) {
    // determine response based on if user is eligible to play good word hunting
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, _consts.PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // use yes intent in reprompt to fire help intent
        var speechText = _consts.VOICE_OPEN + 'Hello, which game would you like to play: ' + 'Whose Tagline Is It Anyway, or Good Word Hunting' + _consts.VOICE_CLOSE;
        var repromptText = _consts.VOICE_OPEN + 'Sorry, I did not quite understand that. Would you like help?' + _consts.VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({ type: 'help' });

        return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
      } else {
        // use yes intent to fire whose tagline intent (game)
        var _speechText = _consts.VOICE_OPEN + 'Hello, welcome to Whose Tagline Is It Anyway. ' + 'Would you like to play a quick round?  ' + "Or, for more information, please say 'help'" + _consts.VOICE_CLOSE;
        var _repromptText = _consts.VOICE_OPEN + 'Sorry, I did not quite understand that. ' + "If you would like more information, please say 'help'." + _consts.VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'whoseTagline'
        });

        return handlerInput.responseBuilder.speak(_speechText).reprompt(_repromptText).getResponse();
      }
    });
  }
};