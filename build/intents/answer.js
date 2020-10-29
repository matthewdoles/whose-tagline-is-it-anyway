'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts'),
    VOICE_OPEN = _require.VOICE_OPEN,
    VOICE_CLOSE = _require.VOICE_CLOSE;

var _require2 = require('../consts/intents'),
    ANSWER_INTENT = _require2.ANSWER_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var AnswerIntent = exports.AnswerIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === ANSWER_INTENT;
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
    }).speak(VOICE_OPEN + 'Alright, what movie is this the tagline for?' + VOICE_CLOSE).reprompt(VOICE_OPEN + 'Any guess is better than nothing.' + VOICE_CLOSE).getResponse();
  }
};