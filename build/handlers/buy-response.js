'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuyResponseHandler = undefined;

var _consts = require('../consts');

var BuyResponseHandler = exports.BuyResponseHandler = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === 'Connections.Response' && input.name === 'Buy';
  },
  handle: function handle(handlerInput) {
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function handlePurchaseResponse() {
      if (handlerInput.requestEnvelope.request.status.code === '200') {
        var speakOutput = void 0;
        var repromptOutput = void 0;

        switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
          case 'ACCEPTED':
            speakOutput = _consts.VOICE_OPEN + 'Thank you for your purchase! You now have full access to ' + 'Good Word Hunting. Would you like to play a game right now?' + _consts.VOICE_CLOSE;
            repromptOutput = _consts.VOICE_OPEN + 'Would you like to play a game right now?' + _consts.VOICE_CLOSE;
            handlerInput.attributesManager.setSessionAttributes({
              type: 'goodWordHunting'
            });
            break;
          case 'DECLINED':
            speakOutput = _consts.VOICE_OPEN + 'Thank you for your interest in buying Good Word Hunting. ' + 'Shall we continue playing Whose Tagline Is It Anyway?' + _consts.VOICE_CLOSE;
            repromptOutput = _consts.VOICE_OPEN + 'Shall we continue playing Whose Tagline Is It Anyway?' + _consts.VOICE_CLOSE;
            handlerInput.attributesManager.setSessionAttributes({
              type: 'whoseTagline'
            });
            break;
          case 'ALREADY_PURCHASED':
            speakOutput = _consts.VOICE_OPEN + 'It appears you already have access to play Good Word Hunting. ' + 'Would you like to play a game right now?' + _consts.VOICE_CLOSE;
            repromptOutput = _consts.VOICE_OPEN + 'Would you like to play a game right now?' + _consts.VOICE_CLOSE;
            handlerInput.attributesManager.setSessionAttributes({
              type: 'goodWordHunting'
            });
            break;
          default:
            speakOutput = _consts.VOICE_OPEN + 'Something unexpected happened during your purchase, thank you for your ' + 'interest in buying Good Word Hunting. Perhaps re-try the transaction in a bit. ' + 'Shall we continue playing Whose Tagline Is It Anyway in the meantime?' + _consts.VOICE_CLOSE;
            repromptOutput = _consts.VOICE_OPEN + 'Shall we continue playing Whose Tagline Is It Anyway in the meantime?' + _consts.VOICE_CLOSE;
            break;
        }

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(repromptOutput).getResponse();
      }

      return handlerInput.responseBuilder.speak(_consts.VOICE_OPEN + 'There was an error handling your purchase request. ' + 'Please try again or contact us for help.' + _consts.VOICE_CLOSE).getResponse();
    });
  }
};