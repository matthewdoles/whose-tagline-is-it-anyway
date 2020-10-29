const {
  GOOD_WORD_HUNTING_INTENT,
  INTENT_REQUEST,
} = require('../consts/intents');
const { PRODUCT_ID, VOICE_CLOSE, VOICE_OPEN } = require('../consts');

export const GoodWordHuntingIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST &&
      input.intent.name === GOOD_WORD_HUNTING_INTENT
    );
  },
  handle(handlerInput) {
    // ensure user is eligible to play good word hunting
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        let responseText =
          VOICE_OPEN +
          'Would you like to play Good Word Hunting with extended time?' +
          VOICE_CLOSE;
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart',
        });
        return handlerInput.responseBuilder
          .speak(responseText)
          .reprompt(responseText)
          .getResponse();
      } else {
        // user not eligible to play, ask if they would like to hear game description
        let helpText = 'Would you like to hear a little bit about this game?';
        let responseText =
          VOICE_OPEN +
          "Sorry, it seems you haven't purchased the rights to play Good Word Hunting. " +
          helpText +
          VOICE_CLOSE;

        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp',
        });
        return handlerInput.responseBuilder
          .speak(responseText)
          .reprompt(helpText)
          .getResponse();
      }
    });
  },
};
