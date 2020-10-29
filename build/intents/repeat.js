'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../consts/intents'),
    INTENT_REQUEST = _require2.INTENT_REQUEST,
    REPEAT_INTENT = _require2.REPEAT_INTENT;

var _require3 = require('./start-game'),
    StartGameIntent = _require3.StartGameIntent;

var RepeatIntent = exports.RepeatIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === REPEAT_INTENT;
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
          return StartGameIntent.handle(handlerInput);
        // if repeat for good word hunting, give keywords and appropriate names within repeat intent, do not re-call MovieCastIntent
        case 'goodWordHunting':
          var _speechText = VOICE_OPEN + 'The ' + attributes.keywords.length + " keywords used to describe this film are <break time='1s'/>";

          for (var i = 0; i < 5; i++) {
            if (i == 4) {
              _speechText += ' and ' + attributes.keywords[i] + ". <break time='1s'/>";
            } else {
              _speechText += attributes.keywords[i] + ", <break time='1s'/>";
            }
          }

          _speechText += 'The ' + attributes.numberNamesNeeded + ' names = require( lowest billed to highest are ';

          var castIndex = attributes.cast.length - 1;
          for (var _i = 1; _i <= attributes.numberNamesNeeded; _i++) {
            if (_i == attributes.numberNamesNeeded) {
              _speechText += 'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
            } else {
              _speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
            }
            castIndex--;
          }

          _speechText += "With that, I'll give you a few more seconds to think of your answer. <break time='4s'/>" + 'Alright, what movie are these keywords and cast members associated with?' + VOICE_CLOSE;
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
          }).speak(_speechText).reprompt(VOICE_OPEN + 'What movie is it?' + VOICE_CLOSE).getResponse();
        default:
          _speechText = VOICE_OPEN + 'Sorry, I am not sure what you are wanting me to repeat. ' + 'Would you like some help?' + VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText = VOICE_OPEN + 'Sorry, I am not sure what you are wanting me to repeat. ' + 'Would you like some help?' + VOICE_CLOSE;
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }
    return handlerInput.responseBuilder.speak(speechText).reprompt(VOICE_OPEN + 'Would you like some help?' + VOICE_CLOSE).getResponse();
  }
};