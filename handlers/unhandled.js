import { VOICE_CLOSE, VOICE_OPEN } from '../consts';

export const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    return handlerInput.responseBuilder
      .speak(
        VOICE_OPEN + 'Sorry, I am not quite sure what to do.' + VOICE_CLOSE
      )
      .getResponse();
  },
};
