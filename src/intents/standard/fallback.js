const { VOICE_OPEN, VOICE_CLOSE } = require('../../consts');
const { FALLBACK_INTENT, INTENT_REQUEST } = require('../../consts/intents');

export const Fallback = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST && input.intent.name === FALLBACK_INTENT
    );
  },
  handle(handlerInput) {
    let reponseText =
      VOICE_OPEN +
      "Sorry, I didn't understand what you said. Please try again." +
      VOICE_CLOSE;

    return handlerInput.responseBuilder
      .speak(reponseText)
      .reprompt(reponseText)
      .getResponse();
  },
};
