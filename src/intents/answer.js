import { VOICE_OPEN, VOICE_CLOSE } from '../consts';
import { ANSWER_INTENT, INTENT_REQUEST } from '../consts/intents';

export const AnswerIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === ANSWER_INTENT;
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
        VOICE_OPEN +
          'Alright, what movie is this the tagline for?' +
          VOICE_CLOSE
      )
      .reprompt(VOICE_OPEN + 'Any guess is better than nothing.' + VOICE_CLOSE)
      .getResponse();
  },
};
