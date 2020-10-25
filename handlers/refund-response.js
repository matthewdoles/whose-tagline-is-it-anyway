import { VOICE_NAME } from '../consts';

export const RefundResponseHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Cancel'
    );
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function handleCancelResponse() {
      if (handlerInput.requestEnvelope.request.status.code === '200') {
        if (
          handlerInput.requestEnvelope.request.payload.purchaseResult ===
          'ACCEPTED'
        ) {
          const speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Your request to refund Good Word Hunting has been processed. Would you like to resume playing Whose Tagline Is It Anyway instead?</voice>";
          const repromptText =
            "<voice name='" +
            VOICE_NAME +
            "'>Would you like to play a game of Whose Tagline Is It Anyway?</voice>";
          handlerInput.attributesManager.setSessionAttributes({
            type: 'whoseTagline',
          });
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
        }

        if (
          handlerInput.requestEnvelope.request.payload.purchaseResult ===
          'NOT_ENTITLED'
        ) {
          const speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, you don't seem to have any purchases available for a refund. This skill has one game available for purchase called Good Word Hunting. Would you like to hear about it?</voice>";
          const repromptText =
            "<voice name='" +
            VOICE_NAME +
            "'>Would you like to hear about Good Word Hunting?</voice>";
          handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHuntingHelp',
          });
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
        }
      }

      return handlerInput.responseBuilder
        .speak(
          'There was an error handling your purchase request. Please try again or contact us for help.'
        )
        .getResponse();
    });
  },
};
