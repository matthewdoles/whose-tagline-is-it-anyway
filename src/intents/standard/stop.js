const { INTENT_REQUEST, STOP_INTENT } = require('../../consts/intents');

export const StopIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === STOP_INTENT;
  },
  handle(handlerInput) {
    // stop intent, exit skill
    return handlerInput.responseBuilder.speak();
  },
};
