import { MOVIEDB_ERROR, VOICE_CLOSE, VOICE_OPEN } from '../consts';
import { HINT_INTENT, INTENT_REQUEST } from '../consts/intents';
import { getMovieCredits } from '../functions/movies';

export const HintIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === HINT_INTENT;
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';

    // if game is whose tagline, allow for two hints
    if (attributes.type == 'whoseTagline' || attributes.type == 'answer') {
      // first hint, year the movie came out, release year passed along in sessions variables
      if (attributes.hint == 1) {
        speechText =
          VOICE_OPEN +
          'This movie came out in ' +
          attributes.year +
          ". Was that any help? I'll give you a few more seconds to think on it. <break time='4s'/>" +
          'Okay, what would you like to do? Repeat the tagline, get one more hint, or answer.' +
          VOICE_CLOSE;
      }
      // second hint, movie top two billed cast members, make api call
      else if (attributes.hint == 2) {
        try {
          const movie = await getMovieCredits(attributes.movieId);
          speechText =
            VOICE_OPEN +
            "The top two billed people for this movie are <break time='1s'/>'" +
            movie.cast[0].name +
            "' and '" +
            movie.cast[1].name +
            "' <break time='1s'/>. With that, I'll give you a few more seconds to think about it." +
            " <break time='4s'/> Okay, that was the last hint I can give you, " +
            'what would you like to do? Repeat the tagline or answer.</voice>';
        } catch (error) {
          speechText =
            VOICE_OPEN + MOVIEDB_ERROR + 'Please try again.' + VOICE_CLOSE;
        }
      }
      // only two hints allowed, prompt for user to answer
      else {
        speechText =
          VOICE_OPEN +
          "I'm sorry, I'm afraid that is all the hints I can give. " +
          'Would you like to repeat the tagline or answer?' +
          VOICE_CLOSE;
      }

      handlerInput.attributesManager.setSessionAttributes({
        type: 'answer',
        movie: attributes.movie,
        movieId: attributes.movieId,
        year: attributes.year,
        tagline: attributes.tagline,
        hint: attributes.hint + 1,
        repeat: 'whoseTagline',
      });

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(
          VOICE_OPEN +
            'Would you like to repeat the tagline or answer?' +
            VOICE_CLOSE
        )
        .getResponse();
    }

    // if game is good word hunting, secretly allow for no hints
    if (attributes.type == 'goodWordHunting') {
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      answerPompt =
        "<break time='4s'/> Okay, what movie are these keywords and cast members associated with?";
      speechText =
        VOICE_OPEN +
        "Sorry, I can't give you any hints, but I'll give you a " +
        'few more seconds to think of your answer.' +
        answerPompt;
      VOICE_CLOSE;

      // if the user asks for a hint three times, give them the year of the movie
      let easterEgg = 1;
      easterEgg = easterEgg + attributes.easterEgg;
      if (easterEgg == 3) {
        speechText =
          VOICE_OPEN +
          'Okay I give in, this movie came out in ' +
          attributes.year +
          ". I hope that helps, I'll give you a few more seconds to think of your answer." +
          answerPompt +
          VOICE_CLOSE;
      }
      // but no more hints after that!
      if (easterEgg > 3) {
        speechText =
          VOICE_OPEN +
          "That is seriously all the hints I am going to give you. However, I'll still " +
          'give you a few more seconds to think of your final answer.' +
          answerPompt +
          VOICE_CLOSE;
      }

      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movieId: attributes.movieId,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
        easterEgg,
        type: 'goodWordHunting',
        numberNamesNeeded: attributes.numberNamesNeeded,
        repeat: 'goodWordHunting',
        time: attributes.time,
      });

      return handlerInput.responseBuilder
        .addDirective({
          type: 'Dialog.ElicitSlot',
          slotToElicit: 'guess',
          updatedIntent: {
            name: 'GameResultsIntent',
            confirmationStatus: 'NONE',
          },
        })
        .speak(speechText)
        .reprompt(VOICE_OPEN + 'What movie is it?' + VOICE_CLOSE)
        .getResponse();
    }
  },
};
