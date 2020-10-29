const { VOICE_CLOSE, VOICE_OPEN } = require('../../consts');
const { INTENT_REQUEST, NO_INTENT } = require('../../consts/intents');
const { StartGameIntent } = require('../start-game');

export const NoIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === NO_INTENT;
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    const unknownResponse =
      VOICE_OPEN +
      'Sorry, I am not sure what you are saying no for. ' +
      'Would you like some help?' +
      VOICE_CLOSE;

    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          speechText =
            VOICE_OPEN +
            "Okay, if you would like more information about this skill's abilities, please say 'help'" +
            VOICE_CLOSE;
          break;
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '4s',
          });
          return StartGameIntent.handle(handlerInput);
        default:
          speechText = unknownResponse;
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText = unknownResponse;
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(VOICE_OPEN + 'Would you like some help?' + VOICE_CLOSE)
      .getResponse();
  },
};
