import { MOVIEDB_ERROR, VOICE_CLOSE, VOICE_OPEN } from '../consts';
import { GET_MOVIE_CAST_INTENT, INTENT_REQUEST } from '../consts/intents';
import { getMovieCredits, searchForMovie } from '../functions/movies';

export const GetMovieCastIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST &&
      input.intent.name === GET_MOVIE_CAST_INTENT
    );
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const movieInput = slots.movie.value;
    const yearInput = slots.year.value;
    let speechText = '';

    // search for movie based on user input
    try {
      const movie = await searchForMovie(movieInput, yearInput);
      // if a result is found, get credits for top (closest matched) result
      if (movie.results.length > 0) {
        const movieId = movie.results[0].id;
        const movieTitle = movie.results[0].title;
        const movieYear = movie.results[0].release_date;
        try {
          const credits = await getMovieCredits(movieId);
          if (credits.cast.length != 0) {
            // if movie has more than 10 credits, only name the top 10 from highest billed to lowest
            if (credits.cast.length < 10) {
              speechText =
                VOICE_OPEN +
                'There are only ' +
                credits.cast.length +
                ' cast members for ' +
                movieTitle +
                ' from ' +
                movieYear.substring(0, 4) +
                '. These ' +
                credits.cast.length +
                " names, from highest billed to lowest are <break time='1s'/>";
              for (let i = 0; i < credits.cast.length; i++) {
                if (i + 1 == credits.cast.length) {
                  speechText +=
                    'and ' +
                    credits.cast[i].name +
                    ". <break time='1s'/>" +
                    VOICE_CLOSE;
                } else {
                  speechText += credits.cast[i].name + ", <break time='1s'/>";
                }
              }
            }
            // if movie has less than 10 credits, name them all from highest billed to lowest
            else {
              speechText =
                VOICE_OPEN +
                'There are over 10 cast members for ' +
                movieTitle +
                ' from ' +
                movieYear.substring(0, 4) +
                ". The top 10 billed names, from highest billed to lowest are <break time='1s'/>";
              for (let i = 0; i < 10; i++) {
                if (i + 1 == 10) {
                  speechText +=
                    'and ' +
                    credits.cast[i].name +
                    ". <break time='1s'/>" +
                    VOICE_CLOSE;
                } else {
                  speechText += credits.cast[i].name + ", <break time='1s'/>";
                }
              }
            }
          }
        } catch (error) {
          speechText =
            VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
        }
      } else {
        // if no result found, reprompt user to include the year of the movie after the title
        speechText =
          VOICE_OPEN +
          'Sorry, I was not able to find a match for ' +
          movieInput +
          '. Try including the year after the title by saying ' +
          "get the cast for 'insert movie' from 'insert year'. " +
          VOICE_CLOSE;
      }
    } catch (error) {
      speechText =
        VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
    }
    let closingText =
      VOICE_OPEN +
      "If you would like to get the cast for another movie, please say get cast for 'insert movie'." +
      VOICE_CLOSE;
    speechText += closingText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(closingText)
      .getResponse();
  },
};
