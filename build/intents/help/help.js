'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelpIntent = undefined;

var _consts = require('../../consts');

var _intents = require('../../consts/intents');

var HelpIntent = exports.HelpIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.request.type === _intents.INTENT_REQUEST && input.intent.name === _intents.HELP_INTENT;
  },
  handle: function handle(handlerInput) {
    // list help options available
    return handlerInput.responseBuilder.speak(_consts.VOICE_OPEN + 'For help and information about Whose Tagline Is It Anyway, ' + "please say 'help with Whose Tagline Is It Anyway'. " + 'For help and information about Good Word Hunting, ' + "please say 'help with Good Word Hunting'. " + 'For help and information about getting the tagline for a specific movie, ' + "please say 'help with getting movie tagline'. " + 'And for help and information about getting the cast for a specific movie, ' + "please say 'help with getting movie cast'." + _consts.VOICE_CLOSE).reprompt(_consts.VOICE_OPEN + 'What area can I help you with?' + _consts.VOICE_CLOSE).getResponse();
  }
};