const alexaTest = require('alexa-skill-test-framework');
const {
  HELP_GET_CAST_INTENT,
  HELP_GET_TAGLINE_INTENT,
  HELP_GWH_GROUP_INTENT,
  HELP_GWH_INTENT,
  HELP_WHOSE_TAGLINE_INTENT,
  HELP_INTENT,
} = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

describe('HelpIntents', function () {
  alexaTest.setExtraFeature('questionMarkCheck', false);
  describe(HELP_GET_CAST_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HELP_GET_CAST_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HELP_GET_TAGLINE_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HELP_GET_TAGLINE_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HELP_GWH_GROUP_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HELP_GWH_GROUP_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HELP_GWH_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HELP_GWH_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HELP_WHOSE_TAGLINE_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HELP_WHOSE_TAGLINE_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HELP_INTENT, function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HELP_INTENT),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
