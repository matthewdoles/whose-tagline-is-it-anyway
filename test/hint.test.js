const alexaTest = require('alexa-skill-test-framework');
const { MOVIE_CAST_INTENT, HINT_INTENT } = require('../build/consts/intents');

// initialize the testing framework
alexaTest.initialize(
  require('../build/index.js'),
  'amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7',
  'amzn1.ask.account.testUser'
);

const whoseTaglineSessionAttributes = {
  movie: 'Rango',
  year: '2011',
  repeat: 'whoseTagline',
  tagline: 'Heroes come in all different colors.',
  movieId: 44896,
  type: 'answer',
};

const goodWordSessionAttributes = {
  cast: [
    'Amanda Seyfried',
    'Lily James',
    'Christine Baranski',
    'Julie Walters',
    'Pierce Brosnan',
    'Colin Firth',
    'Stellan Skarsgård',
    'Dominic Cooper',
    'Meryl Streep',
    'Andy García',
  ],
  movie: 'Mamma Mia! Here We Go Again',
  keywords: [
    'greece',
    'musical',
    'sequel',
    'greek island',
    'aftercreditsstinger',
  ],
  year: '2018',
  repeat: 'goodWordHunting',
  movieId: 458423,
  time: '4s',
  type: 'goodWordHunting',
  numberNamesNeeded: '4',
};

describe(HINT_INTENT, function () {
  describe(HINT_INTENT + ' Whose Tagline Hint #1', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HINT_INTENT),
        withSessionAttributes: { ...whoseTaglineSessionAttributes, hint: 1 },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HINT_INTENT + ' Whose Tagline Hint #2', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HINT_INTENT),
        withSessionAttributes: { ...whoseTaglineSessionAttributes, hint: 2 },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HINT_INTENT + ' Whose Tagline Hint #3', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HINT_INTENT),
        withSessionAttributes: { ...whoseTaglineSessionAttributes, hint: 3 },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HINT_INTENT + ' Good Word Hunting no hint', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HINT_INTENT),
        withSessionAttributes: goodWordSessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HINT_INTENT + ' Good Word Hunting hint easter egg', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HINT_INTENT),
        withSessionAttributes: { ...goodWordSessionAttributes, easterEgg: 2 },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(HINT_INTENT + ' Good Word Hunting no more hints', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(HINT_INTENT),
        withSessionAttributes: { ...goodWordSessionAttributes, easterEgg: 4 },
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
