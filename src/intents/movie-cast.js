import { INTENT_REQUEST, MOVIE_CAST_INTENT } from '../consts/intents';

const { VOICE_CLOSE, VOICE_OPEN } = require('../consts');

export const MovieCastIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST && input.intent.name === MOVIE_CAST_INTENT
    );
  },
  handle(handlerInput) {
    let numberNamesNeeded =
      handlerInput.requestEnvelope.request.intent.slots.numberNamesNeeded.value;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';

    // if slot is not a number, tell user to give a number
    if (isNaN(numberNamesNeeded) == true) {
      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movieId: attributes.movieId,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
        time: attributes.time,
      });
      let unknownNumberResponse =
        'From lowest billed to highest, how many names do you think you need to name this film?';
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
        .speak(
          VOICE_OPEN +
            "I'm sorry, I'm having trouble understanding your response. " +
            unknownNumberResponse +
            VOICE_CLOSE
        )
        .reprompt(VOICE_OPEN + unknownNumberResponse + VOICE_CLOSE)
        .getResponse();
    }
    // if slot number is larger than cast size or smaller than zero, tell user to give a correct number
    else if (
      numberNamesNeeded > attributes.cast.length ||
      numberNamesNeeded < 0
    ) {
      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movieId: attributes.movieId,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
        time: attributes.time,
      });
      let validNumberResponse =
        'From lowest billed to highest, how many names do you think you need to name this film?';
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
        .speak(
          VOICE_OPEN +
            "I'm sorry, the number must be between 0 and " +
            attributes.cast.length +
            '. ' +
            validNumberResponse +
            VOICE_CLOSE
        )
        .reprompt(VOICE_OPEN + validNumberResponse + VOICE_CLOSE)
        .getResponse();
    } else {
      // speech text if user needs zero names
      if (numberNamesNeeded == 0) {
        speechText =
          VOICE_OPEN +
          'You believe you can name this movie with no cast names give. ' +
          'What is the name of this movie?' +
          VOICE_CLOSE;
      }
      // speech text if user needs only one name
      else if (numberNamesNeeded == 1) {
        speechText =
          VOICE_OPEN +
          'You said you need only one name in order to name this movie.' +
          'That lowest billed name is ' +
          attributes.cast[attributes.cast.length - 1] +
          "<break time='1s'/>. " +
          "I'll give you a few more seconds to think of your answer. " +
          "<break time='4s'/> Okay, what is the name of this movie?" +
          VOICE_CLOSE;
      }
      // speech text if user needs all names
      else if (numberNamesNeeded == attributes.cast.length) {
        speechText =
          VOICE_OPEN +
          'You said you need all ' +
          numberNamesNeeded +
          ' names in order to name this movie. ' +
          "Those names from lowest to highest billed are <break time='1s'/>";

        let castIndex = attributes.cast.length - 1;
        for (let i = 1; i <= attributes.cast.length; i++) {
          if (i == numberNamesNeeded) {
            speechText +=
              'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
          } else {
            speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
          }
          castIndex--;
        }
        speechText +=
          "With that, I'll give you a few more seconds to think about it. " +
          "<break time='4s'/> Alright, what movie are these keywords and cast members associated with?" +
          VOICE_CLOSE;
      }
      // speech text if user needs in between two and cast length minus one names
      else {
        speechText =
          VOICE_OPEN +
          'You said you need ' +
          numberNamesNeeded +
          ' out of ' +
          attributes.cast.length +
          ' names in order to name this movie. ' +
          "Those names from lowest to highest billed are <break time='1s'/>";

        let castIndex = attributes.cast.length - 1;
        for (let i = 1; i <= numberNamesNeeded; i++) {
          if (i == numberNamesNeeded) {
            speechText +=
              'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
          } else {
            speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
          }
          castIndex--;
        }
        speechText +=
          "With that, I'll give you a few more seconds to think of your answer. " +
          "<break time='4s'/> Alright, what movie are these keywords and cast members associated with? " +
          'If you would like to hear the keywords and cast members again say repeat.' +
          VOICE_CLOSE;
      }
      // pass along appropriate variables, elicit answer or repeat
      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movieId: attributes.movieId,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
        type: 'goodWordHunting',
        numberNamesNeeded: numberNamesNeeded,
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
            slots: {
              guess: {
                name: 'guess',
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
            'What movie are these keywords and cast members associated with?' +
            VOICE_CLOSE
        )
        .getResponse();
    }
  },
};
