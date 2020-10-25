import { VOICE_NAME } from '../consts';

export const HintIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'HintIntent'
    );
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';

    // if game is whose tagline, allow for two hints
    if (attributes.type == 'whoseTagline' || attributes.type == 'answer') {
      // first hint, year the movie came out, release year passed along in sessions variables
      if (attributes.hint == 1) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>This movie came out in " +
          attributes.year +
          ". Was that any help? I'll give you a few more seconds to think on it. <break time='4s'/>" +
          'Okay, what would you like to do? Repeat the tagline, get one more hint, or answer.</voice>';
      }
      // second hint, movie top two billed cast members, make api call
      else if (attributes.hint == 2) {
        try {
          const movie = await getMovieCredits(attributes.movieId);
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>The top two billed people for this movie are <break time='1s'/>'" +
            movie.cast[0].name +
            "' and '" +
            movie.cast[1].name +
            "' <break time='1s'/>. With that, I'll give you a few more seconds to think about it. <break time='4s'/>" +
            'Okay, that was the last hint I can give you, what would you like to do? Repeat the tagline or answer.</voice>';
        } catch (error) {
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, an error occurred getting data from The Movie Database for your hint. Would you like to answer?</voice>";
        }
      }
      // only two hints allowed, prompt for user to answer
      else {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>I'm sorry, I'm afraid that is all the hints I can give. Would you like to repeat the tagline or answer?</voice>";
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
          "<voice name='" + VOICE_NAME + "'>Would you like to answer?</voice>"
        )
        .getResponse();
    }

    // if game is good word hunting, secretly allow for no hints
    if (attributes.type == 'goodWordHunting') {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, I can't give you any hints, but I'll give you a few more seconds to think of your answer. <break time='4s'/>" +
        'Okay, what movie are these keywords and cast members associated with?</voice>';
      const attributes = handlerInput.attributesManager.getSessionAttributes();

      // if the user asks for a hint three times, give them the year of the movie
      let easterEgg = 1;
      easterEgg = easterEgg + attributes.easterEgg;
      if (easterEgg == 3) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Okay I give in, this movie came out in " +
          attributes.year +
          ". I hope that helps, I'll give you a few more seconds to think of your answer. <break time='4s'/>" +
          'Okay, what movie are these keywords and cast members associated with?</voice>';
      }
      // but no more hints after that!
      if (easterEgg > 3) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>That is seriously all the hints I am going to give you. However, I'll still give you a few more seconds to think of your final answer. <break time='4s'/>" +
          'Okay, what movie are these keywords and cast members associated with?</voice>';
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
        .reprompt("<voice name='" + VOICE_NAME + "'>What movie is it?</voice>")
        .getResponse();
    }
  },
};
