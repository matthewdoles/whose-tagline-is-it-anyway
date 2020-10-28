'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RefundIntent = undefined;

var _intents = require('../../consts/intents');

var _consts = require('../../consts');

var RefundIntent = exports.RefundIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.REFUND_INTENT;
  },
  handle: function handle(handlerInput) {
    return handlerInput.responseBuilder.addDirective({
      type: 'Connections.SendRequest',
      name: 'Cancel',
      payload: {
        InSkillProduct: {
          productId: _consts.PRODUCT_ID
        }
      },
      token: 'correlationToken'
    }).getResponse();
  }
};