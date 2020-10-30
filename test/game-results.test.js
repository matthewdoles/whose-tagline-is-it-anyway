const alexaTest = require('alexa-skill-test-framework');
const { GAME_RESULTS_INTENT } = require('../build/consts/intents');

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

describe(GAME_RESULTS_INTENT, function () {
  describe(GAME_RESULTS_INTENT + ' Whose Tagline', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(GAME_RESULTS_INTENT, {
          guess: 'Rango',
        }),
        withSessionAttributes: whoseTaglineSessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
  describe(GAME_RESULTS_INTENT + ' Good Word Hunting', function () {
    alexaTest.test([
      {
        request: alexaTest.getIntentRequest(GAME_RESULTS_INTENT, {
          guess: 'Mamma Mia! Here We Go Again',
        }),
        withSessionAttributes: goodWordSessionAttributes,
        saysNothing: false,
        repromptsNothing: false,
        shouldEndSession: false,
      },
    ]);
  });
});
