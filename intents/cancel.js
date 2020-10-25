export const CancelIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
    );
  },
  handle(handlerInput) {
    // cancel intent, exit skill
    return handlerInput.responseBuilder.speak();
  },
};
