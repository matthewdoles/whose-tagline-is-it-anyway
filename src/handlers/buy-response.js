const { VOICE_CLOSE, VOICE_OPEN } = require('../consts');

export const BuyResponseHandler = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === 'Connections.Response' && input.name === 'Buy';
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
                VOICE_OPEN +
                'Thank you for your purchase! You now have full access to ' +
                'Good Word Hunting. Would you like to play a game right now?' +
                VOICE_CLOSE;
              repromptOutput =
                VOICE_OPEN +
                'Would you like to play a game right now?' +
                VOICE_CLOSE;
              handlerInput.attributesManager.setSessionAttributes({
                type: 'goodWordHunting',
              });
              break;
            case 'DECLINED':
              speakOutput =
                VOICE_OPEN +
                'Thank you for your interest in buying Good Word Hunting. ' +
                'Shall we continue playing Whose Tagline Is It Anyway?' +
                VOICE_CLOSE;
              repromptOutput =
                VOICE_OPEN +
                'Shall we continue playing Whose Tagline Is It Anyway?' +
                VOICE_CLOSE;
              handlerInput.attributesManager.setSessionAttributes({
                type: 'whoseTagline',
              });
              break;
            case 'ALREADY_PURCHASED':
              speakOutput =
                VOICE_OPEN +
                'It appears you already have access to play Good Word Hunting. ' +
                'Would you like to play a game right now?' +
                VOICE_CLOSE;
              repromptOutput =
                VOICE_OPEN +
                'Would you like to play a game right now?' +
                VOICE_CLOSE;
              handlerInput.attributesManager.setSessionAttributes({
                type: 'goodWordHunting',
              });
              break;
            default:
              speakOutput =
                VOICE_OPEN +
                'Something unexpected happened during your purchase, thank you for your ' +
                'interest in buying Good Word Hunting. Perhaps re-try the transaction in a bit. ' +
                'Shall we continue playing Whose Tagline Is It Anyway in the meantime?' +
                VOICE_CLOSE;
              repromptOutput =
                VOICE_OPEN +
                'Shall we continue playing Whose Tagline Is It Anyway in the meantime?' +
                VOICE_CLOSE;
              break;
          }

          return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
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
