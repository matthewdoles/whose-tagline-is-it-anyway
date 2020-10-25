import { VOICE_NAME } from '../consts';

export const ShopIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ShopIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>If you enjoyed playing Whose Tagline Is It Anyway, you may also be interested in Good Word Hunting. " +
          "For more information please say, 'what is Good Word Hunting'.</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>For more information please say, 'what is Good Word Hunting'.</voice>"
      )
      .getResponse();
  },
};
