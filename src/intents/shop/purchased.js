const { PRODUCT_ID, VOICE_CLOSE, VOICE_OPEN } = require('../../consts');
const { INTENT_REQUEST, PURCHASED_INTENT } = require('../../consts/intents');

export const PurchasedIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST && input.intent.name === PURCHASED_INTENT
    );
  },
  handle(handlerInput) {
    // check if user is eligible to play good word hunting
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled === 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        let speechText =
          VOICE_OPEN +
          'You have purchased the rights to play Good Word Hunting. ' +
          'Would you like to play a quick game?' +
          VOICE_CLOSE;
        let repromptText =
          VOICE_OPEN +
          'Would you like to play a game of Good Word Hunting?' +
          VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart',
        });

        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      } else {
        let speechText =
          VOICE_OPEN +
          'You have not made any in-skill purchases.' +
          VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp',
        });
        return handlerInput.responseBuilder.speak(speechText);
      }
    });
  },
};
