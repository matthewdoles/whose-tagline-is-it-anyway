'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts'),
    PRODUCT_ID = _require.PRODUCT_ID,
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var LaunchRequestHandler = exports.LaunchRequestHandler = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle: function handle(handlerInput) {
    // determine response based on if user is eligible to play good word hunting
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // use yes intent in reprompt to fire help intent
        handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
        return handlerInput.responseBuilder.speak(VOICE_OPEN + 'Hello, which game would you like to play: ' + 'Whose Tagline Is It Anyway, or Good Word Hunting' + VOICE_CLOSE).reprompt(VOICE_OPEN + 'Sorry, I did not quite understand that. Would you like help?' + VOICE_CLOSE).getResponse();
      } else {
        // use yes intent to fire whose tagline intent (game)
        handlerInput.attributesManager.setSessionAttributes({
          type: 'whoseTagline'
        });
        return handlerInput.responseBuilder.speak(VOICE_OPEN + 'Hello, welcome to Whose Tagline Is It Anyway. ' + 'Would you like to play a quick round?  ' + "Or, for more information, please say 'help'" + VOICE_CLOSE).reprompt(VOICE_OPEN + 'Sorry, I did not quite understand that. ' + "If you would like more information, please say 'help'." + VOICE_CLOSE).getResponse();
      }
    });
  }
};