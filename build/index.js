'use strict';

var Alexa = require('ask-sdk');

var _require = require('./handlers/buy-response'),
    BuyResponseHandler = _require.BuyResponseHandler;

var _require2 = require('./handlers/launch-request'),
    LaunchRequestHandler = _require2.LaunchRequestHandler;

var _require3 = require('./handlers/unhandled'),
    UnhandledHandler = _require3.UnhandledHandler;

var _require4 = require('./intents/answer'),
    AnswerIntent = _require4.AnswerIntent;

var _require5 = require('./intents/shop/buy'),
    BuyIntent = _require5.BuyIntent;

var _require6 = require('./intents/standard/cancel'),
    CancelIntent = _require6.CancelIntent;

var _require7 = require('./intents/standard/fallback'),
    Fallback = _require7.Fallback;

var _require8 = require('./intents/game-results'),
    GameResultsIntent = _require8.GameResultsIntent;

var _require9 = require('./intents/good-word-hunting'),
    GoodWordHuntingIntent = _require9.GoodWordHuntingIntent;

var _require10 = require('./intents/get-tagline'),
    GetTaglineIntent = _require10.GetTaglineIntent;

var _require11 = require('./intents/get-movie-cast'),
    GetMovieCastIntent = _require11.GetMovieCastIntent;

var _require12 = require('./intents/help/help'),
    HelpIntent = _require12.HelpIntent;

var _require13 = require('./intents/help/help-whose-tagline'),
    HelpWhoseTaglineIntent = _require13.HelpWhoseTaglineIntent;

var _require14 = require('./intents/help/help-gwh'),
    HelpGWHIntent = _require14.HelpGWHIntent;

var _require15 = require('./intents/help/help-gwh-group'),
    HelpGWHGroupIntent = _require15.HelpGWHGroupIntent;

var _require16 = require('./intents/help/help-get-tagline'),
    HelpGetTaglineIntent = _require16.HelpGetTaglineIntent;

var _require17 = require('./intents/help/help-get-cast'),
    HelpGetCastIntent = _require17.HelpGetCastIntent;

var _require18 = require('./intents/hint'),
    HintIntent = _require18.HintIntent;

var _require19 = require('./intents/movie-cast'),
    MovieCastIntent = _require19.MovieCastIntent;

var _require20 = require('./intents/standard/no'),
    NoIntent = _require20.NoIntent;

var _require21 = require('./intents/shop/purchased'),
    PurchasedIntent = _require21.PurchasedIntent;

var _require22 = require('./intents/shop/refund'),
    RefundIntent = _require22.RefundIntent;

var _require23 = require('./handlers/refund-response'),
    RefundResponseHandler = _require23.RefundResponseHandler;

var _require24 = require('./intents/repeat'),
    RepeatIntent = _require24.RepeatIntent;

var _require25 = require('./intents/shop/shop'),
    ShopIntent = _require25.ShopIntent;

var _require26 = require('./intents/standard/stop'),
    StopIntent = _require26.StopIntent;

var _require27 = require('./intents/whose-tagline'),
    WhoseTaglineIntent = _require27.WhoseTaglineIntent;

var _require28 = require('./intents/start-game'),
    StartGameIntent = _require28.StartGameIntent;

var _require29 = require('./intents/standard/yes'),
    YesIntent = _require29.YesIntent;

var skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder.addRequestHandlers(LaunchRequestHandler, WhoseTaglineIntent, GoodWordHuntingIntent, YesIntent, RepeatIntent, StartGameIntent, MovieCastIntent, HintIntent, AnswerIntent, GameResultsIntent, GetTaglineIntent, GetMovieCastIntent, HelpIntent, HelpWhoseTaglineIntent, HelpGWHIntent, HelpGWHGroupIntent, HelpGetTaglineIntent, HelpGetCastIntent, StopIntent, CancelIntent, NoIntent, Fallback, ShopIntent, BuyIntent, BuyResponseHandler, RefundIntent, RefundResponseHandler, PurchasedIntent, UnhandledHandler).withSkillId('amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7').withApiClient(new Alexa.DefaultApiClient()).addErrorHandlers(UnhandledHandler).lambda();