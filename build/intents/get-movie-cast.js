'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts'),
    MOVIEDB_ERROR = _require.MOVIEDB_ERROR,
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN;

var _require2 = require('../consts/intents'),
    GET_MOVIE_CAST_INTENT = _require2.GET_MOVIE_CAST_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var _require3 = require('../functions/movies'),
    getMovieCredits = _require3.getMovieCredits,
    searchForMovie = _require3.searchForMovie;

var GetMovieCastIntent = exports.GetMovieCastIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === GET_MOVIE_CAST_INTENT;
  },
  handle: async function handle(handlerInput) {
    var slots = handlerInput.requestEnvelope.request.intent.slots;
    var movieInput = slots.movie.value;
    var yearInput = slots.year.value;
    var speechText = '';

    // search for movie based on user input
    try {
      var movie = await searchForMovie(movieInput, yearInput);
      // if a result is found, get credits for top (closest matched) result
      if (movie.results.length > 0) {
        var movieId = movie.results[0].id;
        var movieTitle = movie.results[0].title;
        var movieYear = movie.results[0].release_date;
        try {
          var credits = await getMovieCredits(movieId);
          if (credits.cast.length != 0) {
            // if movie has more than 10 credits, only name the top 10 from highest billed to lowest
            if (credits.cast.length < 10) {
              speechText = VOICE_OPEN + 'There are only ' + credits.cast.length + ' cast members for ' + movieTitle + ' from ' + movieYear.substring(0, 4) + '. These ' + credits.cast.length + " names, from highest billed to lowest are <break time='1s'/>";
              for (var i = 0; i < credits.cast.length; i++) {
                if (i + 1 == credits.cast.length) {
                  speechText += 'and ' + credits.cast[i].name + ". <break time='1s'/>" + VOICE_CLOSE;
                } else {
                  speechText += credits.cast[i].name + ", <break time='1s'/>";
                }
              }
            }
            // if movie has less than 10 credits, name them all from highest billed to lowest
            else {
                speechText = VOICE_OPEN + 'There are over 10 cast members for ' + movieTitle + ' from ' + movieYear.substring(0, 4) + ". The top 10 billed names, from highest billed to lowest are <break time='1s'/>";
                for (var _i = 0; _i < 10; _i++) {
                  if (_i + 1 == 10) {
                    speechText += 'and ' + credits.cast[_i].name + ". <break time='1s'/>" + VOICE_CLOSE;
                  } else {
                    speechText += credits.cast[_i].name + ", <break time='1s'/>";
                  }
                }
              }
          }
        } catch (error) {
          speechText = VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
        }
      } else {
        // if no result found, reprompt user to include the year of the movie after the title
        speechText = VOICE_OPEN + 'Sorry, I was not able to find a match for ' + movieInput + '. Try including the year after the title by saying ' + "get the cast for 'insert movie' from 'insert year'. " + VOICE_CLOSE;
      }
    } catch (error) {
      speechText = VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
    }
    var closingText = VOICE_OPEN + "If you would like to get the cast for another movie, please say get cast for 'insert movie'." + VOICE_CLOSE;
    speechText += closingText;

    return handlerInput.responseBuilder.speak(speechText).reprompt(closingText).getResponse();
  }
};