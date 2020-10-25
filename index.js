const Alexa = require('ask-sdk');
const { VOICE_NAME } = require('./consts');
const {
  getRandomMovie,
  getMovieTagline,
  getMovieKeywords,
  getMovieCredits,
  searchForMovie,
} = require('./functions/movies');

// handlers
const { LaunchRequestHandler } = require('./handlers/launch-request');
const { RefundResponseHandler } = require('./handlers/refund-response');
const { UnhandledHandler } = require('./handlers/unhandled');

// intents
const { AnswerIntent } = require('./intents/answer');
const { BuyIntent } = require('./intents/buy');
const { BuyResponseIntent } = require('./intents/buy-response');
const { CancelIntent } = require('./intents/cancel');
const { Fallback } = require('./intents/fallback');
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
const { NoIntent } = require('./intents/no');
const { PurchasedIntent } = require('./intents/purchased');
const { RefundIntent } = require('./intents/refund');
const { ShopIntent } = require('./intents/shop');
const { StopIntent } = require('./intents/stop');
const { WhoseTaglineIntent } = require('./intents/whose-tagline');

const StartGameIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'StartGameIntent'
    );
  },
  async handle(handlerInput) {
    console.log('StartGameIntent handler called');
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    let repromptText = '';
    var movieId = attributes.movieId;
    var movie = attributes.movie;
    var year = attributes.year;
    var hint = attributes.hint;
    if (hint == undefined) {
      hint = 1;
    }
    console.log(movieId);
    // get a random popular movie if this intent is not being repeated
    if (attributes.movieId == undefined) {
      try {
        let random_movie = await getRandomMovie();
        if (random_movie.results.length > 0) {
          // save variables for random movie
          let random_index = Math.floor(
            Math.random() * random_movie.results.length
          );
          movieId = random_movie.results[random_index].id;
          movie = random_movie.results[random_index].title;
          year = random_movie.results[random_index].release_date;
        }
      } catch (error) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, an error occurred getting data from The Movie Database. Would you like to try again?</voice>";
        repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to try again?</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: attributes.type,
        });
        console.log(error);
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      }
    }
    // if game is whose tagline, make api call for tagline
    if (attributes.type == 'whoseTagline') {
      try {
        let random_movie_tagline = await getMovieTagline(movieId);
        let tagline = random_movie_tagline.tagline;
        //if tagline is not blank, continue with game
        if (tagline) {
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Alright, the tagline for this movie is, '<break time='1s'/>" +
            tagline +
            "<break time='1s'/>'. I'll give you a few seconds to think on it. <break time='4s'/>" +
            'Okay, what would you like to do? Repeat the tagline, get a hint, or answer.</voice>';
          repromptText =
            "<voice name='" +
            VOICE_NAME +
            "'>What would you like to do? Repeat the tagline, get a hint, or answer.</voice>";
          handlerInput.attributesManager.setSessionAttributes({
            type: 'answer',
            tagline: tagline,
            hint: hint,
            movieId: movieId,
            movie: movie,
            year: year.substring(0, 4),
            repeat: 'whoseTagline',
          });
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
        }
        //if tagline is blank, recall intent to get another random movie
        else {
          return WhoseTaglineIntent.handle(handlerInput);
        }
      } catch (error) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, an error occurred getting data from The Movie Database. Please try again.</voice>";
        console.log(error);
      }
    }
    // if game is good word hunting, make api call for keywords then cast members
    else if (attributes.type == 'goodWordHunting') {
      speechText += "<voice name='" + VOICE_NAME + "'>";
      // if game is extended time, prompt so
      if (attributes.time == '20s') {
        speechText +=
          "Okay, you will have 20 seconds for bidding on names. Let's begin. ";
      }
      try {
        let random_movie_keywords = await getMovieKeywords(movieId);
        let keywords = [];
        if (random_movie_keywords.keywords.length != 0) {
          // if less than 5 words available to describe movie, list them all
          if (random_movie_keywords.keywords.length < 5) {
            speechText +=
              'There are only ' +
              random_movie_keywords.keywords.length +
              " keywords used to describe this film. Which are <break time='1s'/>";
            for (let i = 0; i < random_movie_keywords.keywords.length; i++) {
              if (random_movie_keywords.keywords.length - 1 == i) {
                speechText +=
                  'and ' +
                  random_movie_keywords.keywords[i].name +
                  ". <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              } else {
                speechText +=
                  random_movie_keywords.keywords[i].name +
                  ", <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              }
            }
          }
          // if more than 5 words available to describe movie, list the first 5
          else {
            speechText =
              "<voice name='" +
              VOICE_NAME +
              "'>I'll give you 5 keywords used to describe this film. Which are <break time='1s'/>";
            for (let i = 0; i < 5; i++) {
              if (i == 4) {
                speechText +=
                  ' and ' +
                  random_movie_keywords.keywords[i].name +
                  ". <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              } else {
                speechText +=
                  random_movie_keywords.keywords[i].name +
                  ", <break time='1s'/>";
                keywords[i] = random_movie_keywords.keywords[i].name;
              }
            }
          }
          // after getting and listing off keywords, determine number of cast members for movie
          try {
            let random_movie_credits = await getMovieCredits(movieId);
            speechText += "<break time='1s'/> ";
            let cast = [];
            if (random_movie_credits.cast.length != 0) {
              // if less than 10, note the max number of cast members for movie
              if (random_movie_credits.cast.length < 10) {
                speechText +=
                  '>There are only ' +
                  random_movie_credits.cast.length +
                  ' cast members for this film. Out of these ' +
                  random_movie_credits.cast.length +
                  ' names, ';
                for (let i = 0; i < random_movie_credits.cast.length; i++) {
                  cast[i] = random_movie_credits.cast[i].name;
                }
              }
              // if more than 10, note that only the top 10 cast members will be read off
              else {
                speechText +=
                  'There are over 10 cast members for this film. So, out of the top 10 billed names, ';
                for (let i = 0; i < 10; i++) {
                  cast[i] = random_movie_credits.cast[i].name;
                }
              }
              speechText +=
                'from lowest billed to highest, how many names do you think you need to name this film? ';
              // if extended time, break for 20 seconds to allow for bidding time
              if (attributes.time == '20s') {
                speechText +=
                  "Bidding will commence now. <break time='10s'/><break time='10s'/> Okay, successful bidder, how many names will it be?";
              }
              speechText += '</voice>';
            }
            // set session variables, elicit slot for number of names needed
            handlerInput.attributesManager.setSessionAttributes({
              cast: cast,
              movieId: movieId,
              movie: movie,
              year: year.substring(0, 4),
              keywords: keywords,
              phase: 1,
              time: attributes.time,
            });
            return handlerInput.responseBuilder
              .addDirective({
                type: 'Dialog.ElicitSlot',
                slotToElicit: 'numberNamesNeeded',
                updatedIntent: {
                  name: 'MovieCastIntent',
                  confirmationStatus: 'NONE',
                  slots: {
                    numberNamesNeeded: {
                      name: 'numberNamesNeeded',
                      value: 'string',
                      resolutions: {},
                      confirmationStatus: 'NONE',
                    },
                  },
                },
              })
              .speak(speechText)
              .reprompt(
                "<voice name='" +
                  VOICE_NAME +
                  "'>How many names do you need to name this movie?</voice>"
              )
              .getResponse();
          } catch (error) {
            speechText =
              "<voice name='" +
              VOICE_NAME +
              "'>Sorry, an error occurred getting data from The Movie Database. Would you like to try again?</voice>";
            repromptText =
              "<voice name='" +
              VOICE_NAME +
              "'>Would you like to try again?</voice>";
            handlerInput.attributesManager.setSessionAttributes({
              type: attributes.type,
            });
            console.log(error);
            return handlerInput.responseBuilder
              .speak(speechText)
              .reprompt(repromptText)
              .getResponse();
          }
        }
      } catch (error) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, an error occurred getting data from The Movie Database. Would you like to try again?</voice>";
        repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to try again?</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: attributes.type,
        });
        console.log(error);
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      }
    } else {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, an error occurred getting data from The Movie Database. Would you like to try again?</voice>";
      repromptText =
        "<voice name='" + VOICE_NAME + "'>Would you like to try again?</voice>";
      handlerInput.attributesManager.setSessionAttributes({
        type: attributes.type,
      });
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(repromptText)
        .getResponse();
    }
  },
};
const YesIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    );
  },
  async handle(handlerInput) {
    console.log('YesIntent Handler Called');
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          return WhoseTaglineIntent.handle(handlerInput);
        case 'goodWordHunting':
          return GoodWordHuntingIntent.handle(handlerInput);
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '20s',
          });
          return StartGameIntent.handle(handlerInput);
        case 'goodWordHuntingHelp':
          return HelpGoodWordHuntingIntent.handle(handlerInput);
        case 'answer':
          return AnswerIntent.handle(handlerInput);
        case 'help':
          return HelpIntent.handle(handlerInput);
        default:
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, I am not sure what you are saying yes for. Would you like some help?</voice>";
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, I am not sure what you are saying yes for. Would you like some help?</voice>";
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" + VOICE_NAME + "'Would you like some help?</voice>"
      )
      .getResponse();
  },
};
const RepeatIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RepeatIntent'
    );
  },
  handle(handlerInput) {
    console.log('RepeatIntent Handler Called');
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    if (attributes.repeat) {
      switch (attributes.repeat) {
        // if repeat for whose tagline, recall intent and pass variables
        case 'whoseTagline':
          handlerInput.attributesManager.setSessionAttributes({
            type: 'whoseTagline',
            tagline: attributes.tagline,
            hint: attributes.hint,
            movieId: attributes.movieId,
            movie: attributes.movie,
            year: attributes.year,
          });
          return StartGameIntent.handle(handlerInput);
        // if repeat for good word hunting, give keywords and appropriate names within repeat intent, do not re-call MovieCastIntent
        case 'goodWordHunting':
          let speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>The " +
            attributes.keywords.length +
            " keywords used to describe this film are <break time='1s'/>";
          for (let i = 0; i < 5; i++) {
            if (i == 4) {
              speechText +=
                ' and ' + attributes.keywords[i] + ". <break time='1s'/>";
            } else {
              speechText += attributes.keywords[i] + ", <break time='1s'/>";
            }
          }
          speechText +=
            'The ' +
            attributes.numberNamesNeeded +
            ' names from lowest billed to highest are ';
          let castIndex = attributes.cast.length - 1;
          for (let i = 1; i <= attributes.numberNamesNeeded; i++) {
            if (i == attributes.numberNamesNeeded) {
              speechText +=
                'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
            } else {
              speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
            }
            castIndex--;
          }
          speechText +=
            "With that, I'll give you a few more seconds to think of your answer. <break time='4s'/> Alright, what movie are these keywords and cast members associated with?</voice>";
          handlerInput.attributesManager.setSessionAttributes({
            cast: attributes.cast,
            movieId: attributes.movieId,
            movie: attributes.movie,
            year: attributes.year,
            keywords: attributes.keywords,
            type: 'goodWordHunting',
            numberNamesNeeded: attributes.numberNamesNeeded,
            repeat: 'goodWordHunting',
          });
          return handlerInput.responseBuilder
            .addDirective({
              type: 'Dialog.ElicitSlot',
              slotToElicit: 'guess',
              updatedIntent: {
                name: 'GameResultsIntent',
                confirmationStatus: 'NONE',
                slots: {
                  guess: {
                    name: 'guess',
                    value: 'string',
                    resolutions: {},
                    confirmationStatus: 'NONE',
                  },
                },
              },
            })
            .speak(speechText)
            .reprompt(
              "<voice name='" + VOICE_NAME + "'>What movie is it?</voice>"
            )
            .getResponse();
        default:
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, I am not sure what you are wanting me to repeat. Would you like some help?</voice>";
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, I am not sure what you are wanting me to repeat. Would you like some help?</voice>";
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" + VOICE_NAME + "'Would you like some help?</voice>"
      )
      .getResponse();
  },
};

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
