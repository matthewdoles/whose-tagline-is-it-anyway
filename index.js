const Alexa = require('ask-sdk');

// handlers
const { LaunchRequestHandler } = require('./handlers/launch-request');
const { RefundResponseHandler } = require('./handlers/refund-response');
const { UnhandledHandler } = require('./handlers/unhandled');

// intents
const { AnswerIntent } = require('./intents/answer');
const { BuyIntent } = require('./intents/shop/buy');
const { BuyResponseIntent } = require('./handlers/buy-response');
const { CancelIntent } = require('./intents/standard/cancel');
const { Fallback } = require('./intents/standard/fallback');
const { GameResultsIntent } = require('./intents/game-results');
const { GetMovieCastIntent } = require('./intents/get-movie-cast');
const { GetTaglineIntent } = require('./intents/get-tagline');
const { GoodWordHuntingIntent } = require('./intents/good-word-hunting');
const { HelpIntent } = require('./intents/help/help');
const { HelpGetCastIntent } = require('./intents/help/help-get-cast');
const { HelpGetTaglineIntent } = require('./intents/help/help-get-tagline');
const { HelpGWHIntent } = require('./intents/help/help-gwh');
const { HelpGWHGroupIntent } = require('./intents/help/help-gwh-group');
const { HelpWhoseTaglineIntent } = require('./intents/help/help-whose-tagline');
const { HintIntent } = require('./intents/hint');
const { MovieCastIntent } = require('./intents/movie-cast');
const { NoIntent } = require('./intents/standard/no');
const { PurchasedIntent } = require('./intents/shop/purchased');
const { RefundIntent } = require('./intents/shop/refund');
const { RepeatIntent } = require('./intents/repeat');
const { ShopIntent } = require('./intents/shop/shop');
const { StartGameIntent } = require('./intents/start-game');
const { StopIntent } = require('./intents/standard/stop');
const { WhoseTaglineIntent } = require('./intents/whose-tagline');
const { YesIntent } = require('./intents/standard/yes');

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    AnswerIntent,
    BuyIntent,
    BuyResponseIntent,
    CancelIntent,
    Fallback,
    GameResultsIntent,
    GetMovieCastIntent,
    GetTaglineIntent,
    GoodWordHuntingIntent,
    HelpIntent,
    HelpGetCastIntent,
    HelpGetTaglineIntent,
    HelpGWHIntent,
    HelpGWHGroupIntent,
    HelpWhoseTaglineIntent,
    HintIntent,
    LaunchRequestHandler,
    MovieCastIntent,
    NoIntent,
    PurchasedIntent,
    RefundIntent,
    RefundResponseHandler,
    RepeatIntent,
    ShopIntent,
    StartGameIntent,
    StopIntent,
    UnhandledHandler,
    WhoseTaglineIntent,
    YesIntent
  )
  .withSkillId('amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7')
  .withApiClient(new Alexa.DefaultApiClient())
  .addErrorHandlers(UnhandledHandler)
  .lambda();
