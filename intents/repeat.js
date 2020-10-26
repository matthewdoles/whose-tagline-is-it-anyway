import { VOICE_NAME } from '../consts';
import { StartGameIntent } from './start-game';

export const RepeatIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RepeatIntent'
    );
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    if (attributes.repeat) {
      switch (attributes.repeat) {
        // if repeat for whose tagline, recall intent and pass variables
        case 'whoseTagline':
          handlerInput.attributesManager.setSessionAttributes({
            type: 'whoseTagline',
            tagline: attributes.tagline,
            hint: attributes.hint,
            movieId: attributes.movieId,
            movie: attributes.movie,
            year: attributes.year,
          });
          return StartGameIntent.handle(handlerInput);
        // if repeat for good word hunting, give keywords and appropriate names within repeat intent, do not re-call MovieCastIntent
        case 'goodWordHunting':
          let speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>The " +
            attributes.keywords.length +
            " keywords used to describe this film are <break time='1s'/>";
          for (let i = 0; i < 5; i++) {
            if (i == 4) {
              speechText +=
                ' and ' + attributes.keywords[i] + ". <break time='1s'/>";
            } else {
              speechText += attributes.keywords[i] + ", <break time='1s'/>";
            }
          }
          speechText +=
            'The ' +
            attributes.numberNamesNeeded +
            ' names from lowest billed to highest are ';
          let castIndex = attributes.cast.length - 1;
          for (let i = 1; i <= attributes.numberNamesNeeded; i++) {
            if (i == attributes.numberNamesNeeded) {
              speechText +=
                'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
            } else {
              speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
            }
            castIndex--;
          }
          speechText +=
            "With that, I'll give you a few more seconds to think of your answer. <break time='4s'/> Alright, what movie are these keywords and cast members associated with?</voice>";
          handlerInput.attributesManager.setSessionAttributes({
            cast: attributes.cast,
            movieId: attributes.movieId,
            movie: attributes.movie,
            year: attributes.year,
            keywords: attributes.keywords,
            type: 'goodWordHunting',
            numberNamesNeeded: attributes.numberNamesNeeded,
            repeat: 'goodWordHunting',
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
              "<voice name='" + VOICE_NAME + "'>What movie is it?</voice>"
            )
            .getResponse();
        default:
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, I am not sure what you are wanting me to repeat. Would you like some help?</voice>";
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, I am not sure what you are wanting me to repeat. Would you like some help?</voice>";
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" + VOICE_NAME + "'Would you like some help?</voice>"
      )
      .getResponse();
  },
};
