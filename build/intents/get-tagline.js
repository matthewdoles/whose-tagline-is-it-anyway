'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTaglineIntent = undefined;

var _consts = require('../consts');

var _intents = require('../consts/intents');

var _movies = require('../functions/movies');

var GetTaglineIntent = exports.GetTaglineIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.GET_TAGLINE_INTENT;
  },
  handle: async function handle(handlerInput) {
    var movieInput = handlerInput.requestEnvelope.request.intent.slots.movie.value;
    var yearInput = handlerInput.requestEnvelope.request.intent.slots.year.value;
    var speechText = '';

    // search for movie based on user input
    try {
      var movie = await (0, _movies.searchForMovie)(movieInput, yearInput);
      // if a result is found, get tagline for top (closest matched) result
      if (movie.results.length > 0) {
        var movieId = movie.results[0].id;
        try {
          var result = await (0, _movies.getMovieTagline)(movieId);
          var movieTagline = result.tagline;
          var movieTitle = result.original_title;
          var movieYear = result.release_date;
          speechText = _consts.VOICE_CLOSE + 'The tagline for ' + movieTitle + ' from ' + movieYear.substring(0, 4) + " is <break time='1s'/>" + movieTagline + '. ' + _consts.VOICE_CLOSE;
        } catch (error) {
          speechText = _consts.VOICE_OPEN + _consts.MOVIEDB_ERROR + 'Please try again.' + _consts.VOICE_CLOSE;
        }
      }
      // if no result found, reprompt user to include the year of the movie after the title
      else {
          speechText = _consts.VOICE_OPEN + 'Sorry, I was not able to find a match for ' + movieInput + '. Try including the year after the title by saying ' + "get the tagline for 'insert movie' from 'insert year'. " + _consts.VOICE_CLOSE;
        }
    } catch (error) {
      speechText = _consts.VOICE_OPEN + _consts.MOVIEDB_ERROR + 'Please try again.' + _consts.VOICE_CLOSE;
    }
    var closingText = _consts.VOICE_OPEN + "If you would like to get the tagline for another movie, please say get tagline for 'insert movie'." + _consts.VOICE_CLOSE;
    speechText += closingText;

    return handlerInput.responseBuilder.speak(speechText).reprompt(closingText).getResponse();
  }
};