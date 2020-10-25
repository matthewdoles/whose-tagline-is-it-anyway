import { VOICE_NAME } from '../consts';
import { getMovieCredits, searchForMovie } from '../functions/movies';

export const GetMovieCastIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetMovieCastIntent'
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
                "<voice name='" +
                VOICE_NAME +
                "'>There are only " +
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
                    ". <break time='1s'/></voice>";
                } else {
                  speechText += credits.cast[i].name + ", <break time='1s'/>";
                }
              }
            }
            // if movie has less than 10 credits, name them all from highest billed to lowest
            else {
              speechText =
                "<voice name='" +
                VOICE_NAME +
                "'>There are over 10 cast members for " +
                movieTitle +
                ' from ' +
                movieYear.substring(0, 4) +
                ". The top 10 billed names, from highest billed to lowest are <break time='1s'/>";
              for (let i = 0; i < 10; i++) {
                if (i + 1 == 10) {
                  speechText +=
                    'and ' +
                    credits.cast[i].name +
                    ". <break time='1s'/></voice>";
                } else {
                  speechText += credits.cast[i].name + ", <break time='1s'/>";
                }
              }
            }
          }
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
          "get the cast for 'insert movie' from 'insert year'. </voice>";
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
      "'>If you would like to get the cast for another movie, please say get cast for 'insert movie'.</voice>";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you would like to get the cast for another movie, please say get cast for 'insert movie'.</voice>"
      )
      .getResponse();
  },
};
