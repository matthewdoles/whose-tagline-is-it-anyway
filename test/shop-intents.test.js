const alexaTest = require('alexa-skill-test-framework');
const {
  FALLBACK_INTENT,
  SHOP_INTENT,
  REFUND_INTENT,
  BUY_INTENT,
} = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

describe('ShopIntents', function () {
  describe(SHOP_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(SHOP_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(BUY_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(BUY_INTENT),
        saysNothing: true,
        repromptsNothing: true,
        shouldEndSession: true,
      },
    ]);
  });
  describe(REFUND_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(REFUND_INTENT),
        saysNothing: true,
        repromptsNothing: true,
        shouldEndSession: true,
      },
    ]);
  });
});
