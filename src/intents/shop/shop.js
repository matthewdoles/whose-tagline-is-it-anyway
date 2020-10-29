const { VOICE_CLOSE, VOICE_OPEN } = require('../../consts');
const { INTENT_REQUEST, SHOP_INTENT } = require('../../consts/intents');

export const ShopIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === SHOP_INTENT;
  },
  handle(handlerInput) {
    const repromptText =
      "For more information please say, 'what is Good Word Hunting'.";

    return handlerInput.responseBuilder
      .speak(
        VOICE_OPEN +
          'If you enjoyed playing Whose Tagline Is It Anyway, ' +
          'you may also be interested in Good Word Hunting.' +
          repromptText +
          VOICE_CLOSE
      )
      .reprompt(VOICE_OPEN + repromptText + VOICE_CLOSE)
      .getResponse();
  },
};
