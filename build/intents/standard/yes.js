'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../../consts/intents'),
    INTENT_REQUEST = _require2.INTENT_REQUEST,
    YES_INTENT = _require2.YES_INTENT;

var _require3 = require('../answer'),
    AnswerIntent = _require3.AnswerIntent;

var _require4 = require('../good-word-hunting'),
    GoodWordHuntingIntent = _require4.GoodWordHuntingIntent;

var _require5 = require('../help/help'),
    HelpIntent = _require5.HelpIntent;

var _require6 = require('../help/help-gwh'),
    HelpGWHIntent = _require6.HelpGWHIntent;

var _require7 = require('../start-game'),
    StartGameIntent = _require7.StartGameIntent;

var _require8 = require('../whose-tagline'),
    WhoseTaglineIntent = _require8.WhoseTaglineIntent;

var YesIntent = exports.YesIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === YES_INTENT;
  },
  handle: async function handle(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechText = '';
    var unknownResponse = VOICE_OPEN + 'Sorry, I am not sure what you are saying yes for. Would you like some help?' + VOICE_CLOSE;

    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          return WhoseTaglineIntent.handle(handlerInput);
        case 'goodWordHunting':
          return GoodWordHuntingIntent.handle(handlerInput);
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '20s'
          });
          return StartGameIntent.handle(handlerInput);
        case 'goodWordHuntingHelp':
          return HelpGWHIntent.handle(handlerInput);
        case 'answer':
          return AnswerIntent.handle(handlerInput);
        case 'help':
          return HelpIntent.handle(handlerInput);
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