'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('../../consts'),
    PRODUCT_ID = _require.PRODUCT_ID;

var _require2 = require('../../consts/intents'),
    BUY_INTENT = _require2.BUY_INTENT,
    INTENT_REQUEST = _require2.INTENT_REQUEST;

var BuyIntent = exports.BuyIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === BUY_INTENT;
  },
  handle: function handle(handlerInput) {
    return handlerInput.responseBuilder.addDirective({
      type: 'Connections.SendRequest',
      name: 'Buy',
      payload: {
        InSkillProduct: {
          productId: PRODUCT_ID
        }
      },
      token: 'correlationToken'
    }).getResponse();
  }
};