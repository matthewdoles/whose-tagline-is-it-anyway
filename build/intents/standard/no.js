'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoIntent = undefined;

var _consts = require('../../consts');

var _intents = require('../../consts/intents');

var _startGame = require('../start-game');

var NoIntent = exports.NoIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.NO_INTENT;
  },
  handle: async function handle(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechText = '';
    var unknownResponse = _consts.VOICE_OPEN + 'Sorry, I am not sure what you are saying no for. ' + 'Would you like some help?' + _consts.VOICE_CLOSE;

    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          speechText = _consts.VOICE_OPEN + "Okay, if you would like more information about this skill's abilities, please say 'help'" + _consts.VOICE_CLOSE;
          break;
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '4s'
          });
          return _startGame.StartGameIntent.handle(handlerInput);
        default:
          speechText = unknownResponse;
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText = unknownResponse;
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }

    return handlerInput.responseBuilder.speak(speechText).reprompt(_consts.VOICE_OPEN + 'Would you like some help?' + _consts.VOICE_CLOSE).getResponse();
  }
};