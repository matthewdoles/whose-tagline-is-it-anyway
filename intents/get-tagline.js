import { VOICE_NAME } from '../consts';
import { getMovieTagline, searchForMovie } from '../functions/movies';

export const GetTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetTaglineIntent'
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
            "<voice name='" +
            VOICE_NAME +
            "'>The tagline for " +
            movieTitle +
            ' from ' +
            movieYear.substring(0, 4) +
            " is <break time='1s'/>" +
            movieTagline +
            '. </voice>';
        } catch (error) {
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, an error occurred getting data from The Movie Database. Please try again. </voice>";
        }
      }
      // if no result found, reprompt user to include the year of the movie after the title
      else {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I was not able to find a match for " +
          movieInput +
          '. Try including the year after the title by saying ' +
          "get the tagline for 'insert movie' from 'insert year'. </voice>";
      }
    } catch (error) {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, an error occurred getting data from The Movie Database. Please try again. </voice>";
    }
    speechText +=
      "<voice name='" +
      VOICE_NAME +
      "'>If you would like to get the tagline for another movie, please say get tagline for 'insert movie'.</voice>";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you would like to get the tagline for another movie, please say get tagline for 'insert movie'.</voice>"
      )
      .getResponse();
  },
};
