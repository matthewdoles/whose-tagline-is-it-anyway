const alexaTest = require('alexa-skill-test-framework');
const { REPEAT_INTENT } = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

describe(REPEAT_INTENT, function () {
  describe(REPEAT_INTENT + ' Whose Tagline', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(REPEAT_INTENT),
        withSessionAttributes: {
          type: 'whoseTagline',
          movie: 'Arrival',
          year: '2016',
          hint: 1,
          repeat: 'whoseTagline',
          tagline: 'Why are they here?',
          movieId: 329865,
          type: 'answer',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(REPEAT_INTENT + ' Good Word Hunting', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(REPEAT_INTENT),
        withSessionAttributes: {
          cast: [
            'Barbara Luddy',
            'Larry Roberts',
            'Peggy Lee',
            'Bill Thompson',
            'Bill Baucom',
            'Stan Freberg',
            'Verna Felton',
            'Alan Reed',
            'George Givot',
            'Dal McKennon',
          ],
          movie: 'Lady and the Tramp',
          keywords: [
            'cat',
            'spaghetti',
            'lover (female)',
            "love of one's life",
            'kiss',
          ],
          year: '1955',
          repeat: 'goodWordHunting',
          movieId: 10340,
          time: '4s',
          type: 'goodWordHunting',
          numberNamesNeeded: 3,
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(REPEAT_INTENT + ' Unknown', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(REPEAT_INTENT),
        withSessionAttributes: {
          repeat: 'invalid',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(REPEAT_INTENT + ' Unknown', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(REPEAT_INTENT),
        withSessionAttributes: {
          repeat: undefined,
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
