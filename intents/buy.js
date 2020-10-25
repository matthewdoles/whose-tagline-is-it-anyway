import { PRODUCT_ID } from '../consts';

export const BuyIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'BuyIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Connections.SendRequest',
        name: 'Buy',
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
