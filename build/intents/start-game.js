'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../consts'),
    VOICE_CLOSE = _require.VOICE_CLOSE,
    VOICE_OPEN = _require.VOICE_OPEN,
    MOVIEDB_ERROR = _require.MOVIEDB_ERROR;

var _require2 = require('../consts/intents'),
    INTENT_REQUEST = _require2.INTENT_REQUEST,
    START_GAME_INTENT = _require2.START_GAME_INTENT;

var _require3 = require('../functions/movies'),
    getMovieKeywords = _require3.getMovieKeywords,
    getMovieTagline = _require3.getMovieTagline,
    getRandomMovie = _require3.getRandomMovie;

var _require4 = require('./whose-tagline'),
    WhoseTaglineIntent = _require4.WhoseTaglineIntent;

var StartGameIntent = exports.StartGameIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.name === START_GAME_INTENT;
  },
  handle: async function handle(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var speechText = '';
    var repromptText = '';
    var movieId = attributes.movieId;
    var movie = attributes.movie;
    var year = attributes.year;
    var hint = attributes.hint;
    if (hint == undefined) {
      hint = 1;
    }

    // get a random popular movie if this intent is not being repeated
    if (attributes.movieId == undefined) {
      try {
        var randomMovie = await getRandomMovie();
        if (randomMovie.results.length > 0) {
          // save variables for random movie
          var randomIndex = Math.floor(Math.random() * randomMovie.results.length);
          movieId = randomMovie.results[randomIndex].id;
          movie = randomMovie.results[randomIndex].title;
          year = randomMovie.results[randomIndex].release_date;
        }
      } catch (error) {
        var replyText = 'Would you like to try again?';
        speechText = VOICE_OPEN + MOVIEDB_ERROR + replyText + VOICE_CLOSE;
        repromptText = VOICE_OPEN + replyText + VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: attributes.type
        });
        return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
      }
    }

    // if game is whose tagline, make api call for tagline
    if (attributes.type == 'whoseTagline') {
      try {
        var result = await getMovieTagline(movieId);
        var tagline = result.tagline;
        //if tagline is not blank, continue with game
        if (tagline) {
          var _replyText = 'Okay, what would you like to do? Repeat the tagline, get a hint, or answer.';
          speechText = VOICE_OPEN + "Alright, the tagline for this movie is, '<break time='1s'/>" + tagline + "<break time='1s'/>'. I'll give you a few seconds to think on it. <break time='4s'/>" + _replyText + VOICE_CLOSE;
          repromptText = VOICE_OPEN + _replyText + VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({
            type: 'answer',
            tagline: tagline,
            hint: hint,
            movieId: movieId,
            movie: movie,
            year: year.substring(0, 4),
            repeat: 'whoseTagline'
          });
          return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
        }
        //if tagline is blank, recall intent to get another random movie
        else {
            return WhoseTaglineIntent.handle(handlerInput);
          }
      } catch (error) {
        speechText = VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
      }
    }
    // if game is good word hunting, make api call for keywords then cast members
    else if (attributes.type == 'goodWordHunting') {
        speechText += VOICE_OPEN;
        // if game is extended time, prompt so
        if (attributes.time == '20s') {
          speechText += "Okay, you will have 20 seconds for bidding on names. Let's begin. ";
        }
        try {
          var random_movie_keywords = await getMovieKeywords(movieId);
          var keywords = [];
          if (random_movie_keywords.keywords.length != 0) {
            // if less than 5 words available to describe movie, list them all
            if (random_movie_keywords.keywords.length < 5) {
              speechText += 'There are only ' + random_movie_keywords.keywords.length + " keywords used to describe this film. Which are <break time='1s'/>";
              for (var i = 0; i < random_movie_keywords.keywords.length; i++) {
                if (random_movie_keywords.keywords.length - 1 == i) {
                  speechText += 'and ' + random_movie_keywords.keywords[i].name + ". <break time='1s'/>";
                  keywords[i] = random_movie_keywords.keywords[i].name;
                } else {
                  speechText += random_movie_keywords.keywords[i].name + ", <break time='1s'/>";
                  keywords[i] = random_movie_keywords.keywords[i].name;
                }
              }
            }
            // if more than 5 words available to describe movie, list the first 5
            else {
                speechText = VOICE_OPEN + "I'll give you 5 keywords used to describe this film. " + "Which are <break time='1s'/>";

                for (var _i = 0; _i < 5; _i++) {
                  if (_i == 4) {
                    speechText += ' and ' + random_movie_keywords.keywords[_i].name + ". <break time='1s'/>";
                    keywords[_i] = random_movie_keywords.keywords[_i].name;
                  } else {
                    speechText += random_movie_keywords.keywords[_i].name + ", <break time='1s'/>";
                    keywords[_i] = random_movie_keywords.keywords[_i].name;
                  }
                }
              }
            // after getting and listing off keywords, determine number of cast members for movie
            try {
              var credits = await getMovieCredits(movieId);
              speechText += "<break time='1s'/> ";
              var cast = [];
              if (credits.cast.length != 0) {
                // if less than 10, note the max number of cast members for movie
                if (credits.cast.length < 10) {
                  speechText += 'There are only ' + credits.cast.length + ' cast members for this film. Out of these ' + credits.cast.length + ' names, ';
                  for (var _i2 = 0; _i2 < credits.cast.length; _i2++) {
                    cast[_i2] = credits.cast[_i2].name;
                  }
                }
                // if more than 10, note that only the top 10 cast members will be read off
                else {
                    speechText += 'There are over 10 cast members for this film. So, out of the top 10 billed names, ';
                    for (var _i3 = 0; _i3 < 10; _i3++) {
                      cast[_i3] = credits.cast[_i3].name;
                    }
                  }
                speechText += 'from lowest billed to highest, how many names do you think you need to name this film? ';
                // if extended time, break for 20 seconds to allow for bidding time
                if (attributes.time == '20s') {
                  speechText += "Bidding will commence now. <break time='10s'/><break time='10s'/> " + 'Okay, successful bidder, how many names will it be?';
                }
                speechText += VOICE_CLOSE;
              }
              // set session variables, elicit slot for number of names needed
              handlerInput.attributesManager.setSessionAttributes({
                cast: cast,
                movieId: movieId,
                movie: movie,
                year: year.substring(0, 4),
                keywords: keywords,
                phase: 1,
                time: attributes.time
              });
              return handlerInput.responseBuilder.addDirective({
                type: 'Dialog.ElicitSlot',
                slotToElicit: 'numberNamesNeeded',
                updatedIntent: {
                  name: 'MovieCastIntent',
                  confirmationStatus: 'NONE',
                  slots: {
                    numberNamesNeeded: {
                      name: 'numberNamesNeeded',
                      value: 'string',
                      resolutions: {},
                      confirmationStatus: 'NONE'
                    }
                  }
                }
              }).speak(speechText).reprompt(VOICE_OPEN + 'How many names do you need to name this movie?' + VOICE_CLOSE).getResponse();
            } catch (error) {
              var _replyText2 = 'Would you like to try again?';
              speechText = VOICE_OPEN + MOVIEDB_ERROR + _replyText2 + VOICE_CLOSE;
              repromptText = VOICE_OPEN + _replyText2 + VOICE_CLOSE;
              handlerInput.attributesManager.setSessionAttributes({
                type: attributes.type
              });
              return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
            }
          }
        } catch (error) {
          var _replyText3 = 'Would you like to try again?';
          speechText = VOICE_OPEN + MOVIEDB_ERROR + _replyText3 + VOICE_CLOSE;
          repromptText = VOICE_OPEN + _replyText3 + VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({
            type: attributes.type
          });
          return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
        }
      } else {
        var _replyText4 = 'Would you like to try again?';
        speechText = VOICE_OPEN + MOVIEDB_ERROR + _replyText4 + VOICE_CLOSE;
        repromptText = VOICE_OPEN + _replyText4 + VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: attributes.type
        });
        return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
      }
  }
};