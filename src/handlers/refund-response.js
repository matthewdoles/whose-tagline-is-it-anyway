import { VOICE_CLOSE, VOICE_OPEN } from '../consts';

export const RefundResponseHandler = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === 'Connections.Response' && input.name === 'Cancel';
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
            VOICE_OPEN +
            'Your request to refund Good Word Hunting has been processed. ' +
            'Would you like to resume playing Whose Tagline Is It Anyway instead?' +
            VOICE_CLOSE;
          const repromptText =
            VOICE_OPEN +
            'Would you like to play a game of Whose Tagline Is It Anyway?' +
            VOICE_CLOSE;
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
            VOICE_OPEN +
            "Sorry, you don't seem to have any purchases available for a refund. " +
            'This skill has one game available for purchase called Good Word Hunting. ' +
            'Would you like to hear about it?' +
            VOICE_CLOSE;
          const repromptText =
            VOICE_OPEN +
            'Would you like to hear about Good Word Hunting?' +
            VOICE_CLOSE;
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
          VOICE_OPEN +
            'There was an error handling your purchase request. ' +
            'Please try again or contact us for help.' +
            VOICE_CLOSE
        )
        .getResponse();
    });
  },
};
