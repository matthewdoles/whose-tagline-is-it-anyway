const { VOICE_CLOSE, VOICE_OPEN, MOVIEDB_ERROR } = require('../consts');
import { INTENT_REQUEST, START_GAME_INTENT } from '../consts/intents';
import {
  getMovieKeywords,
  getMovieTagline,
  getRandomMovie,
} from '../functions/movies';
import { WhoseTaglineIntent } from './whose-tagline';

export const StartGameIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.name === START_GAME_INTENT;
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    let repromptText = '';
    let movieId = attributes.movieId;
    let movie = attributes.movie;
    let year = attributes.year;
    let hint = attributes.hint;
    if (hint == undefined) {
      hint = 1;
    }

    // get a random popular movie if this intent is not being repeated
    if (attributes.movieId == undefined) {
      try {
        const randomMovie = await getRandomMovie();
        if (randomMovie.results.length > 0) {
          // save variables for random movie
          const randomIndex = Math.floor(
            Math.random() * randomMovie.results.length
          );
          movieId = randomMovie.results[randomIndex].id;
          movie = randomMovie.results[randomIndex].title;
          year = randomMovie.results[randomIndex].release_date;
        }
      } catch (error) {
        const replyText = 'Would you like to try again?';
        speechText = VOICE_OPEN + MOVIEDB_ERROR + replyText + VOICE_CLOSE;
        repromptText = VOICE_OPEN + replyText + VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: attributes.type,
        });
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      }
    }

    // if game is whose tagline, make api call for tagline
    if (attributes.type == 'whoseTagline') {
      try {
        const result = await getMovieTagline(movieId);
        const tagline = result.tagline;
        //if tagline is not blank, continue with game
        if (tagline) {
          const replyText =
            'Okay, what would you like to do? Repeat the tagline, get a hint, or answer.';
          speechText =
            VOICE_OPEN +
            "Alright, the tagline for this movie is, '<break time='1s'/>" +
            tagline +
            "<break time='1s'/>'. I'll give you a few seconds to think on it. <break time='4s'/>" +
            replyText +
            VOICE_CLOSE;
          repromptText = VOICE_OPEN + replyText + VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({
            type: 'answer',
            tagline: tagline,
            hint: hint,
            movieId: movieId,
            movie: movie,
            year: year.substring(0, 4),
            repeat: 'whoseTagline',
          });
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
        }
        //if tagline is blank, recall intent to get another random movie
        else {
          return WhoseTaglineIntent.handle(handlerInput);
        }
      } catch (error) {
        speechText =
          VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
      }
    }
    // if game is good word hunting, make api call for keywords then cast members
    else if (attributes.type == 'goodWordHunting') {
      speechText += VOICE_OPEN;
      // if game is extended time, prompt so
      if (attributes.time == '20s') {
        speechText +=
          "Okay, you will have 20 seconds for bidding on names. Let's begin. ";
      }
      try {
        let random_movie_keywords = await getMovieKeywords(movieId);
        let keywords = [];
        if (random_movie_keywords.keywords.length != 0) {
          // if less than 5 words available to describe movie, list them all
          if (random_movie_keywords.keywords.length < 5) {
            speechText +=
              'There are only ' +
              random_movie_keywords.keywords.length +
              " keywords used to describe this film. Which are <break time='1s'/>";
            for (let i = 0; i < random_movie_keywords.keywords.length; i++) {
              if (random_movie_keywords.keywords.length - 1 == i) {
                speechText +=
                  'and ' +
                  random_movie_keywords.keywords[i].name +
                  ". <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              } else {
                speechText +=
                  random_movie_keywords.keywords[i].name +
                  ", <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              }
            }
          }
          // if more than 5 words available to describe movie, list the first 5
          else {
            speechText =
              VOICE_OPEN +
              "I'll give you 5 keywords used to describe this film. " +
              "Which are <break time='1s'/>";

            for (let i = 0; i < 5; i++) {
              if (i == 4) {
                speechText +=
                  ' and ' +
                  random_movie_keywords.keywords[i].name +
                  ". <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              } else {
                speechText +=
                  random_movie_keywords.keywords[i].name +
                  ", <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              }
            }
          }
          // after getting and listing off keywords, determine number of cast members for movie
          try {
            const credits = await getMovieCredits(movieId);
            speechText += "<break time='1s'/> ";
            let cast = [];
            if (credits.cast.length != 0) {
              // if less than 10, note the max number of cast members for movie
              if (credits.cast.length < 10) {
                speechText +=
                  'There are only ' +
                  credits.cast.length +
                  ' cast members for this film. Out of these ' +
                  credits.cast.length +
                  ' names, ';
                for (let i = 0; i < credits.cast.length; i++) {
                  cast[i] = credits.cast[i].name;
                }
              }
              // if more than 10, note that only the top 10 cast members will be read off
              else {
                speechText +=
                  'There are over 10 cast members for this film. So, out of the top 10 billed names, ';
                for (let i = 0; i < 10; i++) {
                  cast[i] = credits.cast[i].name;
                }
              }
              speechText +=
                'from lowest billed to highest, how many names do you think you need to name this film? ';
              // if extended time, break for 20 seconds to allow for bidding time
              if (attributes.time == '20s') {
                speechText +=
                  "Bidding will commence now. <break time='10s'/><break time='10s'/> " +
                  'Okay, successful bidder, how many names will it be?';
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
              time: attributes.time,
            });
            return handlerInput.responseBuilder
              .addDirective({
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
                      confirmationStatus: 'NONE',
                    },
                  },
                },
              })
              .speak(speechText)
              .reprompt(
                VOICE_OPEN +
                  'How many names do you need to name this movie?' +
                  VOICE_CLOSE
              )
              .getResponse();
          } catch (error) {
            const replyText = 'Would you like to try again?';
            speechText = VOICE_OPEN + MOVIEDB_ERROR + replyText + VOICE_CLOSE;
            repromptText = VOICE_OPEN + replyText + VOICE_CLOSE;
            handlerInput.attributesManager.setSessionAttributes({
              type: attributes.type,
            });
            return handlerInput.responseBuilder
              .speak(speechText)
              .reprompt(repromptText)
              .getResponse();
          }
        }
      } catch (error) {
        const replyText = 'Would you like to try again?';
        speechText = VOICE_OPEN + MOVIEDB_ERROR + replyText + VOICE_CLOSE;
        repromptText = VOICE_OPEN + replyText + VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: attributes.type,
        });
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      }
    } else {
      const replyText = 'Would you like to try again?';
      speechText = VOICE_OPEN + MOVIEDB_ERROR + replyText + VOICE_CLOSE;
      repromptText = VOICE_OPEN + replyText + VOICE_CLOSE;
      handlerInput.attributesManager.setSessionAttributes({
        type: attributes.type,
      });
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(repromptText)
        .getResponse();
    }
  },
};
