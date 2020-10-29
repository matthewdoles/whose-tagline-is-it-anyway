'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts/intents'),
    INTENT_REQUEST = _require.INTENT_REQUEST,
    REFUND_INTENT = _require.REFUND_INTENT;

var _require2 = require('../../consts'),
    PRODUCT_ID = _require2.PRODUCT_ID;

var RefundIntent = exports.RefundIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === REFUND_INTENT;
  },
  handle: function handle(handlerInput) {
    return handlerInput.responseBuilder.addDirective({
      type: 'Connections.SendRequest',
      name: 'Cancel',
      payload: {
        InSkillProduct: {
          productId: PRODUCT_ID
        }
      },
      token: 'correlationToken'
    }).getResponse();
  }
};