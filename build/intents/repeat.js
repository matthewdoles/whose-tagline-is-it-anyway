'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepeatIntent = undefined;

var _consts = require('../consts');

var _intents = require('../consts/intents');

var _startGame = require('./start-game');

var RepeatIntent = exports.RepeatIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.REPEAT_INTENT;
  },
  handle: function handle(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechText = '';

    if (attributes.repeat) {
      switch (attributes.repeat) {
        // if repeat for whose tagline, recall intent and pass variables
        case 'whoseTagline':
          handlerInput.attributesManager.setSessionAttributes({
            type: 'whoseTagline',
            tagline: attributes.tagline,
            hint: attributes.hint,
            movieId: attributes.movieId,
            movie: attributes.movie,
            year: attributes.year
          });
          return _startGame.StartGameIntent.handle(handlerInput);
        // if repeat for good word hunting, give keywords and appropriate names within repeat intent, do not re-call MovieCastIntent
        case 'goodWordHunting':
          var _speechText = _consts.VOICE_OPEN + 'The ' + attributes.keywords.length + " keywords used to describe this film are <break time='1s'/>";

          for (var i = 0; i < 5; i++) {
            if (i == 4) {
              _speechText += ' and ' + attributes.keywords[i] + ". <break time='1s'/>";
            } else {
              _speechText += attributes.keywords[i] + ", <break time='1s'/>";
            }
          }

          _speechText += 'The ' + attributes.numberNamesNeeded + ' names from lowest billed to highest are ';

          var castIndex = attributes.cast.length - 1;
          for (var _i = 1; _i <= attributes.numberNamesNeeded; _i++) {
            if (_i == attributes.numberNamesNeeded) {
              _speechText += 'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
            } else {
              _speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
            }
            castIndex--;
          }

          _speechText += "With that, I'll give you a few more seconds to think of your answer. <break time='4s'/>" + 'Alright, what movie are these keywords and cast members associated with?' + _consts.VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({
            cast: attributes.cast,
            movieId: attributes.movieId,
            movie: attributes.movie,
            year: attributes.year,
            keywords: attributes.keywords,
            type: 'goodWordHunting',
            numberNamesNeeded: attributes.numberNamesNeeded,
            repeat: 'goodWordHunting'
          });
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
          }).speak(_speechText).reprompt(_consts.VOICE_OPEN + 'What movie is it?' + _consts.VOICE_CLOSE).getResponse();
        default:
          _speechText = _consts.VOICE_OPEN + 'Sorry, I am not sure what you are wanting me to repeat. ' + 'Would you like some help?' + _consts.VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText = _consts.VOICE_OPEN + 'Sorry, I am not sure what you are wanting me to repeat. ' + 'Would you like some help?' + _consts.VOICE_CLOSE;
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }
    return handlerInput.responseBuilder.speak(speechText).reprompt(_consts.VOICE_OPEN + 'Would you like some help?' + _consts.VOICE_CLOSE).getResponse();
  }
};