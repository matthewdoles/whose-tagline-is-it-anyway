'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../../consts/intents'),
    INTENT_REQUEST = _require2.INTENT_REQUEST,
    NO_INTENT = _require2.NO_INTENT;

var _require3 = require('../start-game'),
    StartGameIntent = _require3.StartGameIntent;

var NoIntent = exports.NoIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === NO_INTENT;
  },
  handle: async function handle(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechText = '';
    var unknownResponse = VOICE_OPEN + 'Sorry, I am not sure what you are saying no for. ' + 'Would you like some help?' + VOICE_CLOSE;

    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          speechText = VOICE_OPEN + "Okay, if you would like more information about this skill's abilities, please say 'help'" + VOICE_CLOSE;
          break;
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '4s'
          });
          return StartGameIntent.handle(handlerInput);
        default:
          speechText = unknownResponse;
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText = unknownResponse;
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }

    return handlerInput.responseBuilder.speak(speechText).reprompt(VOICE_OPEN + 'Would you like some help?' + VOICE_CLOSE).getResponse();
  }
};