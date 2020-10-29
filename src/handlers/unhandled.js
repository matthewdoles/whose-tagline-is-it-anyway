const { VOICE_CLOSE, VOICE_OPEN } = require('../consts');

export const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(error);
    return handlerInput.responseBuilder
      .speak(
        VOICE_OPEN + 'Sorry, I am not quite sure what to do.' + VOICE_CLOSE
      )
      .getResponse();
  },
};
