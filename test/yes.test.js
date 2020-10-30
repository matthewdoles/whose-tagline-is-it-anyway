const alexaTest = require('alexa-skill-test-framework');
const { YES_INTENT } = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

describe(YES_INTENT, function () {
  describe(YES_INTENT + ' Whose Tagline', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(YES_INTENT),
        withSessionAttributes: {
          type: 'whoseTagline',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(YES_INTENT + ' Good Word Hunting extended time', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(YES_INTENT),
        withSessionAttributes: {
          type: 'goodWordHuntingStart',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(YES_INTENT + ' Good Word Hunting Help', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(YES_INTENT),
        withSessionAttributes: {
          type: 'goodWordHuntingHelp',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(YES_INTENT + ' Answer', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(YES_INTENT),
        withSessionAttributes: {
          type: 'answer',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(YES_INTENT + ' Help', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(YES_INTENT),
        withSessionAttributes: {
          type: 'help',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(YES_INTENT + ' Invalid Type', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(YES_INTENT),
        withSessionAttributes: {
          type: 'invalid',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(YES_INTENT + ' No Type', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(YES_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
