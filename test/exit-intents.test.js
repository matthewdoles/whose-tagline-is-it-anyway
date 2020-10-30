const alexaTest = require('alexa-skill-test-framework');
const {
  CANCEL_INTENT,
  STOP_INTENT,
  FALLBACK_INTENT,
} = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

describe('ExitIntents', function () {
  describe(CANCEL_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(CANCEL_INTENT),
        saysNothing: true,
        repromptsNothing: true,
        shouldEndSession: true,
      },
    ]);
  });
  describe(STOP_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(STOP_INTENT),
        saysNothing: true,
        repromptsNothing: true,
        shouldEndSession: true,
      },
    ]);
  });
});
