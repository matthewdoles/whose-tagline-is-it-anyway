const { CANCEL_INTENT, INTENT_REQUEST } = require('../../consts/intents');

export const CancelIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === CANCEL_INTENT;
  },
  handle(handlerInput) {
    // cancel intent, exit skill
    return handlerInput.responseBuilder.speak();
  },
};
