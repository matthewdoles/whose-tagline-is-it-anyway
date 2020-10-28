'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefundResponseHandler = undefined;

var _consts = require('../consts');

var RefundResponseHandler = exports.RefundResponseHandler = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === 'Connections.Response' && input.name === 'Cancel';
  },
  handle: function handle(handlerInput) {
    var locale = handlerInput.requestEnvelope.request.locale;
    var ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function handleCancelResponse() {
      if (handlerInput.requestEnvelope.request.status.code === '200') {
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ACCEPTED') {
          var speechText = _consts.VOICE_OPEN + 'Your request to refund Good Word Hunting has been processed. ' + 'Would you like to resume playing Whose Tagline Is It Anyway instead?' + _consts.VOICE_CLOSE;
          var repromptText = _consts.VOICE_OPEN + 'Would you like to play a game of Whose Tagline Is It Anyway?' + _consts.VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({
            type: 'whoseTagline'
          });
          return handlerInput.responseBuilder.speak(speechText).reprompt(repromptText).getResponse();
        }

        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'NOT_ENTITLED') {
          var _speechText = _consts.VOICE_OPEN + "Sorry, you don't seem to have any purchases available for a refund. " + 'This skill has one game available for purchase called Good Word Hunting. ' + 'Would you like to hear about it?' + _consts.VOICE_CLOSE;
          var _repromptText = _consts.VOICE_OPEN + 'Would you like to hear about Good Word Hunting?' + _consts.VOICE_CLOSE;
          handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHuntingHelp'
          });
          return handlerInput.responseBuilder.speak(_speechText).reprompt(_repromptText).getResponse();
        }
      }

      return handlerInput.responseBuilder.speak(_consts.VOICE_OPEN + 'There was an error handling your purchase request. ' + 'Please try again or contact us for help.' + _consts.VOICE_CLOSE).getResponse();
    });
  }
};