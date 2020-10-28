'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameResultsIntent = undefined;

var _consts = require('../consts');

var _intents = require('../consts/intents');

var GameResultsIntent = exports.GameResultsIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.GAME_RESULTS_INTENT;
  },
  handle: function handle(handlerInput) {
    var guess = handlerInput.requestEnvelope.request.intent.slots.guess.value;
    var attributes = handlerInput.attributesManager.getSessionAttributes();

    // finalize game results for good word hunting game
    if (attributes.type == 'goodWordHunting') {
      // recap keywords
      var speechText = _consts.VOICE_OPEN + "Okay, to recap, the keywords for this movie were <break time='1s'/>'";
      for (var i = 0; i < attributes.keywords.length; i++) {
        if (attributes.keywords.length - 1 == i) {
          speechText += 'and ' + attributes.keywords[i] + ". <break time='1s'/>";
        } else {
          speechText += attributes.keywords[i] + ", <break time='1s'/>";
        }
      }
      // compare answers
      speechText += "Your guess was, '" + guess + "'. And the answer is, <break time='1s'/> '" + attributes.movie + "'. ";
      var numberOfNamesLeft = attributes.cast.length - attributes.numberNamesNeeded;
      // give remaining names from highest to lowest billed
      if (numberOfNamesLeft == 1) {
        speechText += ' The remaining name was ' + attributes.cast[0] + '. ';
      }
      if (numberOfNamesLeft == 2) {
        speechText += ' The remaining names from top billed to lowest were ' + attributes.cast[0] + ' and ' + attributes.cast[1] + '. ';
      }
      if (numberOfNamesLeft > 2) {
        speechText += ' The remaining names from top billed to lowest were ';
        for (var _i = 0; _i < numberOfNamesLeft; _i++) {
          if (_i + 1 == numberOfNamesLeft) {
            speechText += 'and ' + attributes.cast[_i] + '. ';
          } else {
            speechText += attributes.cast[_i] + ', ';
          }
        }
      }
      // prompt for new game
      handlerInput.attributesManager.setSessionAttributes({
        type: 'goodWordHunting'
      });
      speechText += 'Thank you for playing, would you like to play another round?' + _consts.VOICE_CLOSE;
      return handlerInput.responseBuilder.speak(speechText).reprompt(_consts.VOICE_OPEN + "To play another round, please say 'play Good Word Hunting" + _consts.VOICE_CLOSE).getResponse();
    }
    // finalize game results for whose tagline is it anyway
    else {
        var _speechText = _consts.VOICE_OPEN + "Okay, to recap, the tagline was <break time='1s'/>'" + attributes.tagline + "'<break time='1s'/>. Your guess was, '" + guess + "'. And the answer is, <break time='1s'/> '" + attributes.movie + "' <break time='1s'/>. Thank you for playing. Would like to play another round?" + _consts.VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'whoseTagline'
        });
        return handlerInput.responseBuilder.speak(_speechText).reprompt(_consts.VOICE_OPEN + "To play another round, please say 'play Whose Tagline Is It Anyway'." + _consts.VOICE_CLOSE).getResponse();
      }
  }
};