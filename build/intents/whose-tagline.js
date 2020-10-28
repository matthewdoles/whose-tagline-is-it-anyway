'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WhoseTaglineIntent = undefined;

var _intents = require('../consts/intents');

var _startGame = require('./start-game');

var WhoseTaglineIntent = exports.WhoseTaglineIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.WHOSE_TAGLINE_INTENT;
  },
  handle: function handle(handlerInput) {
    // set game type to whose tagline, call start game intent
    handlerInput.attributesManager.setSessionAttributes({
      type: 'whoseTagline'
    });
    return _startGame.StartGameIntent.handle(handlerInput);
  }
};