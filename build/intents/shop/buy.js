'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuyIntent = undefined;

var _consts = require('../../consts');

var _intents = require('../../consts/intents');

var BuyIntent = exports.BuyIntent = {
  canHandle: function canHandle(handlerInput) {
    var input = handlerInput.requestEnvelope.request;
    return input.type === _intents.INTENT_REQUEST && input.intent.name === _intents.BUY_INTENT;
  },
  handle: function handle(handlerInput) {
    return handlerInput.responseBuilder.addDirective({
      type: 'Connections.SendRequest',
      name: 'Buy',
      payload: {
        InSkillProduct: {
          productId: _consts.PRODUCT_ID
        }
      },
      token: 'correlationToken'
    }).getResponse();
  }
};