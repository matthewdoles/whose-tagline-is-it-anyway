import { PRODUCT_ID } from '../../consts';
import { BUY_INTENT, INTENT_REQUEST } from '../../consts/intents';

export const BuyIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === BUY_INTENT;
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
