'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts/intents'),
    INTENT_REQUEST = _require.INTENT_REQUEST,
    WHOSE_TAGLINE_INTENT = _require.WHOSE_TAGLINE_INTENT;

var _require2 = require('./start-game'),
    StartGameIntent = _require2.StartGameIntent;

var WhoseTaglineIntent = exports.WhoseTaglineIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === WHOSE_TAGLINE_INTENT;
  },
  handle: function handle(handlerInput) {
    // set game type to whose tagline, call start game intent
    handlerInput.attributesManager.setSessionAttributes({
      type: 'whoseTagline'
    });
    return StartGameIntent.handle(handlerInput);
  }
};