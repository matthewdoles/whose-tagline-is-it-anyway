import { VOICE_NAME } from '../consts';

export const BuyResponseIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Buy'
    );
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms
      .getInSkillProducts(locale)
      .then(function handlePurchaseResponse() {
        if (handlerInput.requestEnvelope.request.status.code === '200') {
          let speakOutput;
          let repromptOutput;
          switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
            case 'ACCEPTED':
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Thank you for your purchase! You now have full access to Good Word Hunting. Would you like to play a game right now?</voice>";
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Would you like to play a game right now?</voice>";
              handlerInput.attributesManager.setSessionAttributes({
                type: 'goodWordHunting',
              });
              break;
            case 'DECLINED':
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Thank you for your interest in buying Good Word Hunting. Shall we continue playing Whose Tagline Is It Anyway?</voice>";
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Shall we continue playing Whose Tagline Is It Anyway?</voice>";
              handlerInput.attributesManager.setSessionAttributes({
                type: 'whoseTagline',
              });
              break;
            case 'ALREADY_PURCHASED':
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>It appears you already have access to play Good Word Hunting. Would you like to play a game right now?</voice>";
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Would you like to play a game right now?</voice>";
              handlerInput.attributesManager.setSessionAttributes({
                type: 'goodWordHunting',
              });
              break;
            default:
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Something unexpected happened during your purchase, thank you for your interest in buying Good Word Hunting. " +
                'Perhaps re-try the transaction in a bit. Shall we continue playing Whose Tagline Is It Anyway in the meantime?</voice>';
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Shall we continue playing Whose Tagline Is It Anyway in the meantime?</voice>";
              break;
          }

          return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }

        return handlerInput.responseBuilder
          .speak(
            "<voice name='" +
              VOICE_NAME +
              "'>There was an error handling your purchase request. Please try again or contact us for help.</voice>"
          )
          .getResponse();
      });
  },
};
