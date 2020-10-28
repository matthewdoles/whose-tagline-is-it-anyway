'use strict';

var Alexa = require('ask-sdk');

// handlers

var _require = require('./handlers/launch-request'),
    LaunchRequestHandler = _require.LaunchRequestHandler;

var _require2 = require('./handlers/refund-response'),
    RefundResponseHandler = _require2.RefundResponseHandler;

var _require3 = require('./handlers/unhandled'),
    UnhandledHandler = _require3.UnhandledHandler;

// intents


var _require4 = require('./intents/answer'),
    AnswerIntent = _require4.AnswerIntent;

var _require5 = require('./intents/shop/buy'),
    BuyIntent = _require5.BuyIntent;

var _require6 = require('./handlers/buy-response'),
    BuyResponseHandler = _require6.BuyResponseHandler;

var _require7 = require('./intents/standard/cancel'),
    CancelIntent = _require7.CancelIntent;

var _require8 = require('./intents/standard/fallback'),
    Fallback = _require8.Fallback;

var _require9 = require('./intents/game-results'),
    GameResultsIntent = _require9.GameResultsIntent;

var _require10 = require('./intents/get-movie-cast'),
    GetMovieCastIntent = _require10.GetMovieCastIntent;

var _require11 = require('./intents/get-tagline'),
    GetTaglineIntent = _require11.GetTaglineIntent;

var _require12 = require('./intents/good-word-hunting'),
    GoodWordHuntingIntent = _require12.GoodWordHuntingIntent;

var _require13 = require('./intents/help/help'),
    HelpIntent = _require13.HelpIntent;

var _require14 = require('./intents/help/help-get-cast'),
    HelpGetCastIntent = _require14.HelpGetCastIntent;

var _require15 = require('./intents/help/help-get-tagline'),
    HelpGetTaglineIntent = _require15.HelpGetTaglineIntent;

var _require16 = require('./intents/help/help-gwh'),
    HelpGWHIntent = _require16.HelpGWHIntent;

var _require17 = require('./intents/help/help-gwh-group'),
    HelpGWHGroupIntent = _require17.HelpGWHGroupIntent;

var _require18 = require('./intents/help/help-whose-tagline'),
    HelpWhoseTaglineIntent = _require18.HelpWhoseTaglineIntent;

var _require19 = require('./intents/hint'),
    HintIntent = _require19.HintIntent;

var _require20 = require('./intents/movie-cast'),
    MovieCastIntent = _require20.MovieCastIntent;

var _require21 = require('./intents/standard/no'),
    NoIntent = _require21.NoIntent;

var _require22 = require('./intents/shop/purchased'),
    PurchasedIntent = _require22.PurchasedIntent;

var _require23 = require('./intents/shop/refund'),
    RefundIntent = _require23.RefundIntent;

var _require24 = require('./intents/repeat'),
    RepeatIntent = _require24.RepeatIntent;

var _require25 = require('./intents/shop/shop'),
    ShopIntent = _require25.ShopIntent;

var _require26 = require('./intents/start-game'),
    StartGameIntent = _require26.StartGameIntent;

var _require27 = require('./intents/standard/stop'),
    StopIntent = _require27.StopIntent;

var _require28 = require('./intents/whose-tagline'),
    WhoseTaglineIntent = _require28.WhoseTaglineIntent;

var _require29 = require('./intents/standard/yes'),
    YesIntent = _require29.YesIntent;

var skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder.addRequestHandlers(AnswerIntent, BuyIntent, BuyResponseHandler, CancelIntent, Fallback, GameResultsIntent, GetMovieCastIntent, GetTaglineIntent, GoodWordHuntingIntent, HelpIntent, HelpGetCastIntent, HelpGetTaglineIntent, HelpGWHIntent, HelpGWHGroupIntent, HelpWhoseTaglineIntent, HintIntent, LaunchRequestHandler, MovieCastIntent, NoIntent, PurchasedIntent, RefundIntent, RefundResponseHandler, RepeatIntent, ShopIntent, StartGameIntent, StopIntent, UnhandledHandler, WhoseTaglineIntent, YesIntent).withSkillId('amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7').withApiClient(new Alexa.DefaultApiClient()).addErrorHandlers(UnhandledHandler).lambda();