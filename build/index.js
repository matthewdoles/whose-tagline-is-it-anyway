'use strict';

var _askSdk = require('ask-sdk');

var Alexa = _interopRequireWildcard(_askSdk);

var _buyResponse = require('./handlers/buy-response');

var _buyResponse2 = _interopRequireDefault(_buyResponse);

var _launchRequest = require('./handlers/launch-request');

var _launchRequest2 = _interopRequireDefault(_launchRequest);

var _refundResponse = require('./handlers/refund-response');

var _refundResponse2 = _interopRequireDefault(_refundResponse);

var _unhandled = require('./handlers/unhandled');

var _unhandled2 = _interopRequireDefault(_unhandled);

var _answer = require('./intents/answer');

var _answer2 = _interopRequireDefault(_answer);

var _buy = require('./intents/shop/buy');

var _buy2 = _interopRequireDefault(_buy);

var _cancel = require('./intents/standard/cancel');

var _cancel2 = _interopRequireDefault(_cancel);

var _fallback = require('./intents/standard/fallback');

var _fallback2 = _interopRequireDefault(_fallback);

var _gameResults = require('./intents/game-results');

var _gameResults2 = _interopRequireDefault(_gameResults);

var _getMovieCast = require('./intents/get-movie-cast');

var _getMovieCast2 = _interopRequireDefault(_getMovieCast);

var _getTagline = require('./intents/get-tagline');

var _getTagline2 = _interopRequireDefault(_getTagline);

var _goodWordHunting = require('./intents/good-word-hunting');

var _goodWordHunting2 = _interopRequireDefault(_goodWordHunting);

var _help = require('./intents/help/help');

var _help2 = _interopRequireDefault(_help);

var _helpGetCast = require('./intents/help/help-get-cast');

var _helpGetCast2 = _interopRequireDefault(_helpGetCast);

var _helpGetTagline = require('./intents/help/help-get-tagline');

var _helpGetTagline2 = _interopRequireDefault(_helpGetTagline);

var _helpGwh = require('./intents/help/help-gwh');

var _helpGwh2 = _interopRequireDefault(_helpGwh);

var _helpGwhGroup = require('./intents/help/help-gwh-group');

var _helpGwhGroup2 = _interopRequireDefault(_helpGwhGroup);

var _helpWhoseTagline = require('./intents/help/help-whose-tagline');

var _helpWhoseTagline2 = _interopRequireDefault(_helpWhoseTagline);

var _hint = require('./intents/hint');

var _hint2 = _interopRequireDefault(_hint);

var _movieCast = require('./intents/movie-cast');

var _movieCast2 = _interopRequireDefault(_movieCast);

var _no = require('./intents/standard/no');

var _no2 = _interopRequireDefault(_no);

var _purchased = require('./intents/shop/purchased');

var _purchased2 = _interopRequireDefault(_purchased);

var _refund = require('./intents/shop/refund');

var _refund2 = _interopRequireDefault(_refund);

var _repeat = require('./intents/repeat');

var _repeat2 = _interopRequireDefault(_repeat);

var _shop = require('./intents/shop/shop');

var _shop2 = _interopRequireDefault(_shop);

var _startGame = require('./intents/start-game');

var _startGame2 = _interopRequireDefault(_startGame);

var _stop = require('./intents/standard/stop');

var _stop2 = _interopRequireDefault(_stop);

var _whoseTagline = require('./intents/whose-tagline');

var _whoseTagline2 = _interopRequireDefault(_whoseTagline);

var _yes = require('./intents/standard/yes');

var _yes2 = _interopRequireDefault(_yes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var skillBuilder = Alexa.SkillBuilders.custom();

// intents


// handlers

exports.handler = skillBuilder.addRequestHandlers(_launchRequest2.default, _whoseTagline2.default, _goodWordHunting2.default, _startGame2.default, _yes2.default, _help2.default, _repeat2.default, _movieCast2.default, _hint2.default, _answer2.default, _gameResults2.default, _getTagline2.default, _getMovieCast2.default, _stop2.default, _cancel2.default, _no2.default, _fallback2.default, _shop2.default, _buy2.default, _buyResponse2.default, _refund2.default, _refundResponse2.default, _purchased2.default, _helpWhoseTagline2.default, _helpGwh2.default, _helpGwhGroup2.default, _helpGetTagline2.default, _helpGetCast2.default, _unhandled2.default).withSkillId('amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7').withApiClient(new Alexa.DefaultApiClient()).addErrorHandlers(_unhandled2.default).lambda();