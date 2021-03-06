'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../../consts/intents'),
    HELP_GET_TAGLINE_INTENT = _require2.HELP_GET_TAGLINE_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var HelpGetTaglineIntent = exports.HelpGetTaglineIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === HELP_GET_TAGLINE_INTENT;
  },
  handle: function handle(handlerInput) {
    // help option explaining how to use the ability to get a tagline for any movie
    return handlerInput.responseBuilder.speak(VOICE_OPEN + 'You can use this skill to get the tagline of any movie. ' + "Simply say 'get tagline for insert movie'. " + "Or, you can say 'what is the tagline for insert movie'. " + 'If you are having trouble getting the tagline for the right movie, ' + 'try appending the year the movie came out after the movie title. ' + "So, you would say 'what is the tagline for insert movie from insert year movie came out'. " + 'This skill can not be used during a game. ' + 'If it is, your current round progress will be lost. ' + 'If you would like to hear this information again, ' + "please say 'help with getting movie tagline'" + VOICE_CLOSE).reprompt(VOICE_OPEN + "If you need help, please say 'help'." + VOICE_CLOSE).getResponse();
  }
};