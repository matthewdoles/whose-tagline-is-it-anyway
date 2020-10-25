import { StartGameIntent } from './start-game';

export const WhoseTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'WhoseTaglineIntent'
    );
  },
  handle(handlerInput) {
    // set game type to whose tagline, call start game intent
    handlerInput.attributesManager.setSessionAttributes({
      type: 'whoseTagline',
    });
    return StartGameIntent.handle(handlerInput);
  },
};
