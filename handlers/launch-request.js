import { PRODUCT_ID, VOICE_NAME } from '../consts';

export const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    // determine response based on if user is eligible to play good word hunting
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // use yes intent in reprompt to fire help intent
        const speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Hello, which game would you like to play: Whose Tagline Is It Anyway, or Good Word Hunting</voice>";
        const repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I did not quite understand that. Would you like help?</voice>";
        handlerInput.attributesManager.setSessionAttributes({ type: 'help' });

        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      } else {
        // use yes intent to fire whose tagline intent (game)
        const speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Hello, welcome to Whose Tagline Is It Anyway. Would you like to play a quick round? Or, for more information, please say 'help'</voice>";
        const repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I did not quite understand that. If you would like more information, please say 'help'.</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'whoseTagline',
        });

        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      }
    });
  },
};
