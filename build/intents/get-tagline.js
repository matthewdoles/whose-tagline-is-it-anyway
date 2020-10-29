'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts'),
    MOVIEDB_ERROR = _require.MOVIEDB_ERROR,
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../consts/intents'),
    GET_TAGLINE_INTENT = _require2.GET_TAGLINE_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var _require3 = require('../functions/movies'),
    getMovieTagline = _require3.getMovieTagline,
    searchForMovie = _require3.searchForMovie;

var GetTaglineIntent = exports.GetTaglineIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === GET_TAGLINE_INTENT;
  },
  handle: async function handle(handlerInput) {
    var movieInput = handlerInput.requestEnvelope.request.intent.slots.movie.value;
    var yearInput = handlerInput.requestEnvelope.request.intent.slots.year.value;
    var speechText = '';

    // search for movie based on user input
    try {
      var movie = await searchForMovie(movieInput, yearInput);
      // if a result is found, get tagline for top (closest matched) result
      if (movie.results.length > 0) {
        var movieId = movie.results[0].id;
        try {
          var result = await getMovieTagline(movieId);
          var movieTagline = result.tagline;
          var movieTitle = result.original_title;
          var movieYear = result.release_date;
          speechText = VOICE_CLOSE + 'The tagline for ' + movieTitle + ' from ' + movieYear.substring(0, 4) + " is <break time='1s'/>" + movieTagline + '. ' + VOICE_CLOSE;
        } catch (error) {
          speechText = VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
        }
      }
      // if no result found, reprompt user to include the year of the movie after the title
      else {
          speechText = VOICE_OPEN + 'Sorry, I was not able to find a match for ' + movieInput + '. Try including the year after the title by saying ' + "get the tagline for 'insert movie' from 'insert year'. " + VOICE_CLOSE;
        }
    } catch (error) {
      speechText = VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
    }
    var closingText = VOICE_OPEN + "If you would like to get the tagline for another movie, please say get tagline for 'insert movie'." + VOICE_CLOSE;
    speechText += closingText;

    return handlerInput.responseBuilder.speak(speechText).reprompt(closingText).getResponse();
  }
};