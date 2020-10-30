const alexaTest = require('alexa-skill-test-framework');
const { MOVIE_CAST_INTENT } = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

const sessionAttributes = {
  cast: [
    'Scott Adsit',
    'Ryan Potter',
    'Daniel Henney',
    'T. J. Miller',
    'Jamie Chung',
    'Damon Wayans Jr.',
    'Génesis Rodríguez',
    'James Cromwell',
    'Alan Tudyk',
    'Maya Rudolph',
  ],
  movie: 'Big Hero 6',
  keywords: [
    'sibling relationship',
    'san francisco, california',
    'martial arts',
    'hero',
    'talent',
  ],
  year: '2014',
  repeat: 'goodWordHunting',
  movieId: 177572,
  time: '20s',
  type: 'goodWordHunting',
};

describe(MOVIE_CAST_INTENT, function () {
  describe(MOVIE_CAST_INTENT + ' w/ valid number', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(MOVIE_CAST_INTENT, {
          numberNamesNeeded: 4,
        }),
        withSessionAttributes: sessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(MOVIE_CAST_INTENT + ' w/out valid number', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(MOVIE_CAST_INTENT, {
          numberNamesNeeded: 'invalid',
        }),
        withSessionAttributes: sessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(MOVIE_CAST_INTENT + ' w/ guess too large', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(MOVIE_CAST_INTENT, {
          numberNamesNeeded: 20,
        }),
        withSessionAttributes: sessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(MOVIE_CAST_INTENT + ' w/ one cast', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(MOVIE_CAST_INTENT, {
          numberNamesNeeded: 20,
        }),
        withSessionAttributes: sessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(MOVIE_CAST_INTENT + ' w/ no cast', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(MOVIE_CAST_INTENT, {
          numberNamesNeeded: 20,
        }),
        withSessionAttributes: sessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(MOVIE_CAST_INTENT + ' w/ all cast', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(MOVIE_CAST_INTENT, {
          numberNamesNeeded: 10,
        }),
        withSessionAttributes: sessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
