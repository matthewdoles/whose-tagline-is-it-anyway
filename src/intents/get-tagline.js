const { MOVIEDB_ERROR, VOICE_CLOSE, VOICE_OPEN } = require('../consts');
const { GET_TAGLINE_INTENT, INTENT_REQUEST } = require('../consts/intents');
const { getMovieTagline, searchForMovie } = require('../functions/movies');

export const GetTaglineIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST && input.intent.name === GET_TAGLINE_INTENT
    );
  },
  async handle(handlerInput) {
    const movieInput =
      handlerInput.requestEnvelope.request.intent.slots.movie.value;
    const yearInput =
      handlerInput.requestEnvelope.request.intent.slots.year.value;
    let speechText = '';

    // search for movie based on user input
    try {
      const movie = await searchForMovie(movieInput, yearInput);
      // if a result is found, get tagline for top (closest matched) result
      if (movie.results.length > 0) {
        const movieId = movie.results[0].id;
        try {
          const result = await getMovieTagline(movieId);
          const movieTagline = result.tagline;
          const movieTitle = result.original_title;
          const movieYear = result.release_date;
          speechText =
            VOICE_OPEN +
            'The tagline for ' +
            movieTitle +
            ' from ' +
            movieYear.substring(0, 4) +
            " is <break time='1s'/>" +
            movieTagline +
            '. ' +
            VOICE_CLOSE;
        } catch (error) {
          speechText =
            VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
        }
      }
      // if no result found, reprompt user to include the year of the movie after the title
      else {
        speechText =
          VOICE_OPEN +
          'Sorry, I was not able to find a match for ' +
          movieInput +
          '. Try including the year after the title by saying ' +
          "get the tagline for 'insert movie' from 'insert year'. " +
          VOICE_CLOSE;
      }
    } catch (error) {
      speechText =
        VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
    }
    let closingText =
      VOICE_OPEN +
      "If you would like to get the tagline for another movie, please say get tagline for 'insert movie'." +
      VOICE_CLOSE;
    speechText += closingText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(closingText)
      .getResponse();
  },
};
