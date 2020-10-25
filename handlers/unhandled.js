import { VOICE_NAME } from '../consts';

export const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    let speechText =
      "<voice name='" +
      VOICE_NAME +
      "'>Sorry, I am not quite sure what to do.</voice>";
    return handlerInput.responseBuilder.speak(speechText).getResponse();
  },
};
