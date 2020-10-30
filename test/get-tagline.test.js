const alexaTest = require('alexa-skill-test-framework');
const { GET_TAGLINE_INTENT } = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);
describe(GET_TAGLINE_INTENT, function () {
  describe(GET_TAGLINE_INTENT + ' Positive', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(GET_TAGLINE_INTENT, {
          movie: 'alien',
          year: 1979,
        }),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(GET_TAGLINE_INTENT + ' Negative', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(GET_TAGLINE_INTENT, {
          movie: 'dbsdfbsdf',
          year: 0000,
        }),
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
