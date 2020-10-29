const { INTENT_REQUEST, REFUND_INTENT } = require('../../consts/intents');
const { PRODUCT_ID } = require('../../consts');

export const RefundIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === REFUND_INTENT;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Connections.SendRequest',
        name: 'Cancel',
        payload: {
          InSkillProduct: {
            productId: PRODUCT_ID,
          },
        },
        token: 'correlationToken',
      })
      .getResponse();
  },
};
