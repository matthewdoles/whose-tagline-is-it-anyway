'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnswerIntent = undefined;

var _consts = require('../consts');

var _intents = require('../consts/intents');

var AnswerIntent = exports.AnswerIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.ANSWER_INTENT;
  },
  handle: function handle(handlerInput) {
    // answer intent for whose tagline game only
    return handlerInput.responseBuilder.addDirective({
      type: 'Dialog.ElicitSlot',
      slotToElicit: 'guess',
      updatedIntent: {
        name: 'GameResultsIntent',
        confirmationStatus: 'NONE',
        slots: {
          guess: {
            name: 'guess',
            value: 'string',
            resolutions: {},
            confirmationStatus: 'NONE'
          }
        }
      }
    }).speak(_consts.VOICE_OPEN + 'Alright, what movie is this the tagline for?' + _consts.VOICE_CLOSE).reprompt(_consts.VOICE_OPEN + 'Any guess is better than nothing.' + _consts.VOICE_CLOSE).getResponse();
  }
};