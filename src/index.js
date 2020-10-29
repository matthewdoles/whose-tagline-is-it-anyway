const Alexa = require('ask-sdk');
let voice_name = 'Matthew';
const productId = process.env.GOOD_WORD_HUNTING_PRODUCT_ID;

const { BuyResponseHandler } = require('./handlers/buy-response');
const { LaunchRequestHandler } = require('./handlers/launch-request');
const { UnhandledHandler } = require('./handlers/unhandled');

const { AnswerIntent } = require('./intents/answer');
const { BuyIntent } = require('./intents/shop/buy');
const { CancelIntent } = require('./intents/standard/cancel');
const { Fallback } = require('./intents/standard/fallback');
const { GameResultsIntent } = require('./intents/game-results');
const { GoodWordHuntingIntent } = require('./intents/good-word-hunting');
const { GetTaglineIntent } = require('./intents/get-tagline');
const { GetMovieCastIntent } = require('./intents/get-movie-cast');
const { HelpIntent } = require('./intents/help/help');
const { HelpWhoseTaglineIntent } = require('./intents/help/help-whose-tagline');
const { HelpGWHIntent } = require('./intents/help/help-gwh');
const { HelpGWHGroupIntent } = require('./intents/help/help-gwh-group');
const { HelpGetTaglineIntent } = require('./intents/help/help-get-tagline');
const { HelpGetCastIntent } = require('./intents/help/help-get-cast');
const { HintIntent } = require('./intents/hint');
const { MovieCastIntent } = require('./intents/movie-cast');
const { NoIntent } = require('./intents/standard/no');
const { PurchasedIntent } = require('./intents/shop/purchased');
const { RefundIntent } = require('./intents/shop/refund');
const { RefundResponseHandler } = require('./handlers/refund-response');
const { RepeatIntent } = require('./intents/repeat');
const { ShopIntent } = require('./intents/shop/shop');
const { StopIntent } = require('./intents/standard/stop');
const { WhoseTaglineIntent } = require('./intents/whose-tagline');
const { StartGameIntent } = require('./intents/start-game');
const { YesIntent } = require('./intents/standard/yes');

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    WhoseTaglineIntent,
    GoodWordHuntingIntent,
    YesIntent,
    RepeatIntent,
    StartGameIntent,
    MovieCastIntent,
    HintIntent,
    AnswerIntent,
    GameResultsIntent,
    GetTaglineIntent,
    GetMovieCastIntent,
    HelpIntent,
    HelpWhoseTaglineIntent,
    HelpGWHIntent,
    HelpGWHGroupIntent,
    HelpGetTaglineIntent,
    HelpGetCastIntent,
    StopIntent,
    CancelIntent,
    NoIntent,
    Fallback,
    ShopIntent,
    BuyIntent,
    BuyResponseHandler,
    RefundIntent,
    RefundResponseHandler,
    PurchasedIntent,
    UnhandledHandler
  )
  .withSkillId('amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7')
  .withApiClient(new Alexa.DefaultApiClient())
  .addErrorHandlers(UnhandledHandler)
  .lambda();
