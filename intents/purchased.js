import { PRODUCT_ID, VOICE_NAME } from '../consts';

export const PurchasedIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'PurchasedIntent'
    );
  },
  handle(handlerInput) {
    // check if user is eligible to play good word hunting
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        let speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You have purchased the rights to play Good Word Hunting. Would you like to play a quick game?</voice>";
        let repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play a game of Good Word Hunting?</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart',
        });

        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      } else {
        // user not eligible to play, ask if they would like to hear game description
        let speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You have not made any in-skill purchases.</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp',
        });
        return handlerInput.responseBuilder.speak(speechText);
      }
    });
  },
};
