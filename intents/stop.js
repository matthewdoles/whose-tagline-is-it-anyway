export const StopIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
    );
  },
  handle(handlerInput) {
    // stop intent, exit skill
    return handlerInput.responseBuilder.speak();
  },
};
