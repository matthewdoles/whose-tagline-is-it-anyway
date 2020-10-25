const { VOICE_NAME, PRODUCT_ID } = require('../consts');

export const GoodWordHuntingIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'GoodWordHuntingIntent'
    );
  },
  handle(handlerInput) {
    // ensure user is eligible to play good word hunting
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        let speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play Good Word Hunting with extended time?</voice>";
        let repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play Good Word Hunting with extended time?</voice>";
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
          "'>Sorry, it seems you haven't purchased the rights to play Good Word Hunting. Would you like to hear a little bit about this game?</voice>";
        let repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to hear a little bit about Good Word Hunting?</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp',
        });
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      }
    });
  },
};
