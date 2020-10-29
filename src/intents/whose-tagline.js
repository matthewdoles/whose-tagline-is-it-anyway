const { INTENT_REQUEST, WHOSE_TAGLINE_INTENT } = require('../consts/intents');
const { StartGameIntent } = require('./start-game');

export const WhoseTaglineIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST &&
      input.intent.name === WHOSE_TAGLINE_INTENT
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
