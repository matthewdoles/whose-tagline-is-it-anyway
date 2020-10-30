const alexaTest = require('alexa-skill-test-framework');
const { START_GAME_INTENT } = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

describe(START_GAME_INTENT, function () {
  describe(START_GAME_INTENT + ' Whose Tagline', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(START_GAME_INTENT),
        withSessionAttributes: {
          type: 'whoseTagline',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(START_GAME_INTENT + ' Whose Tagline invalid movie id', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(START_GAME_INTENT),
        withSessionAttributes: {
          type: 'whoseTagline',
          movieId: 263,
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(START_GAME_INTENT + ' Good Word Hunting', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(START_GAME_INTENT),
        withSessionAttributes: {
          type: 'goodWordHunting',
          time: '20s',
        },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(
    START_GAME_INTENT + ' Good Word Hunting less than 5 keywords',
    function () {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest(START_GAME_INTENT),
          withSessionAttributes: {
            type: 'goodWordHunting',
            movieId: 9876,
          },
          saysNothing: false,
          repromptsNothing: false,
          shouldEndSession: false,
        },
      ]);
    }
  );
  describe(
    START_GAME_INTENT + ' Good Word Hunting less than 10 cast',
    function () {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest(START_GAME_INTENT),
          withSessionAttributes: {
            type: 'goodWordHunting',
            movieId: 49047,
          },
          saysNothing: false,
          repromptsNothing: false,
          shouldEndSession: false,
        },
      ]);
    }
  );
  describe(
    START_GAME_INTENT + ' Good Word Hunting invalid movie id',
    function () {
      alexaTest.test([
        {
          request: alexaTest.getIntentRequest(START_GAME_INTENT),
          withSessionAttributes: {
            type: 'goodWordHunting',
            movieId: 263,
          },
          saysNothing: false,
          repromptsNothing: false,
          shouldEndSession: false,
        },
      ]);
    }
  );
});
