const { VOICE_NAME } = require('../consts');

export const NoIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    );
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';

    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Okay, if you would like more information about this skill's abilities, please say 'help'</voice>";
          break;
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '4s',
          });
          return StartGameIntent.handle(handlerInput);
        default:
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, I am not sure what you are saying no for. Would you like some help?</voice>";
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, I am not sure what you are saying no for. Would you like some help?</voice>";
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" + VOICE_NAME + "'>Would you like some help?</voice>"
      )
      .getResponse();
  },
};
