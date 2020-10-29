'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../../consts/intents'),
    HELP_GWH_INTENT = _require2.HELP_GWH_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var HelpGWHIntent = exports.HelpGWHIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.request.type === INTENT_REQUEST && input.intent.name === HELP_GWH_INTENT;
  },
  handle: function handle(handlerInput) {
    // help option explaining how to play Good Word Hunting
    return handlerInput.responseBuilder.speak(VOICE_OPEN + 'Good Word Hunting is an additional game available for purchase. ' + 'At the start of the game, you will be given up to 5 keywords associated ' + 'with a random movie. With those keywords, you will then be asked how many ' + 'cast members from lowest billed to highest, would you need to guess what ' + 'the movie is. With a number given, I will then list off the corresponding ' + 'number of names, again from lowest billed to highest. However, If you believe ' + 'you know what the movie is based on just the keywords, you are also ' + 'welcome to say zero names. After that, you will be prompted to answer. ' + 'With an answer given, results will be compared and the correct answer given. ' + 'To learn about playing Good Word Hunting in a group setting,  ' + "say 'how to play Good Word Hunting in a group setting'. " + "If you are interested in buying Good Word Hunting, please say 'buy Good Word Hunting'" + VOICE_CLOSE).reprompt(VOICE_OPEN + "If you need help, please say 'help'." + VOICE_CLOSE).getResponse();
  }
};