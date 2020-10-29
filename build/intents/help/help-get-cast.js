'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../../consts/intents'),
    HELP_GET_CAST_INTENT = _require2.HELP_GET_CAST_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var HelpGetCastIntent = exports.HelpGetCastIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === HELP_GET_CAST_INTENT;
  },
  handle: function handle(handlerInput) {
    // help option explaining how to use the ability to get the cast for any movie
    return handlerInput.responseBuilder.speak(VOICE_OPEN + 'You can use this skill to get the cast list of any movie.' + "Simply say 'who was in insert movie'. " + "Or, you can say 'get cast for insert movie. " + 'If you are having trouble getting the cast list for the right movie, try appending the year the movie ' + 'try appending the year the movie came out after the movie title. ' + "So, you would say 'who was in insert movie = require( insert year movie came out'. " + 'This skill can not be used during a game.' + 'If it is, your current round progress will be lost. ' + "If you would like to hear this information again, please say 'help with getting movie cast'" + VOICE_CLOSE).reprompt(VOICE_OPEN + "If you need help, please say 'help'." + VOICE_CLOSE).getResponse();
  }
};