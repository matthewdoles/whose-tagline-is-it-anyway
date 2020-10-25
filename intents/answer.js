import { VOICE_NAME } from '../consts';

export const AnswerIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent'
    );
  },
  handle(handlerInput) {
    // answer intent for whose tagline game only
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
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>Alright, what movie is this the tagline for?</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>Any guess is better than nothing.</voice>"
      )
      .getResponse();
  },
};
