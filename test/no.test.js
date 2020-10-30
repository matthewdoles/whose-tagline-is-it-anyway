const alexaTest = require('alexa-skill-test-framework');
const { NO_INTENT } = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

describe(NO_INTENT, function () {
  describe(NO_INTENT + ' Whose Tagline', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(NO_INTENT),
        withSessionAttributes: {
          type: 'whoseTagline',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(NO_INTENT + ' Good Word Hunting', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(NO_INTENT),
        withSessionAttributes: {
          type: 'goodWordHuntingStart',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(NO_INTENT + ' Invalid Type', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(NO_INTENT),
        withSessionAttributes: {
          type: 'invalid',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(NO_INTENT + ' No Type', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(NO_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
