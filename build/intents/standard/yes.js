'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YesIntent = undefined;

var _consts = require('../../consts');

var _intents = require('../../consts/intents');

var _answer = require('../answer');

var _goodWordHunting = require('../good-word-hunting');

var _help = require('../help/help');

var _helpGwh = require('../help/help-gwh');

var _startGame = require('../start-game');

var _whoseTagline = require('../whose-tagline');

var YesIntent = exports.YesIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.YES_INTENT;
  },
  handle: async function handle(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechText = '';
    var unknownResponse = _consts.VOICE_OPEN + 'Sorry, I am not sure what you are saying yes for. Would you like some help?' + _consts.VOICE_CLOSE;

    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          return _whoseTagline.WhoseTaglineIntent.handle(handlerInput);
        case 'goodWordHunting':
          return _goodWordHunting.GoodWordHuntingIntent.handle(handlerInput);
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '20s'
          });
          return _startGame.StartGameIntent.handle(handlerInput);
        case 'goodWordHuntingHelp':
          return _helpGwh.HelpGWHIntent.handle(handlerInput);
        case 'answer':
          return _answer.AnswerIntent.handle(handlerInput);
        case 'help':
          return _help.HelpIntent.handle(handlerInput);
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