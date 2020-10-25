const { VOICE_NAME } = require('../consts');

export const Fallback = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I didn't understand what you said. Please try again.</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I didn't understand what you said. Please try again.</voice>"
      )
      .getResponse();
  },
};
