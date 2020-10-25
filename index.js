const Alexa = require('ask-sdk');
const { PRODUCT_ID, VOICE_NAME } = require('./consts');
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

const WhoseTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'WhoseTaglineIntent'
    );
  },
  handle(handlerInput) {
    console.log('WhoseTaglineIntent handler called');
    // set game type to whose tagline, call start game intent
    handlerInput.attributesManager.setSessionAttributes({
      type: 'whoseTagline',
    });
    return StartGameIntent.handle(handlerInput);
  },
};
const GoodWordHuntingIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'GoodWordHuntingIntent'
    );
  },
  handle(handlerInput) {
    console.log('GoodWordHuntingIntent handler called');
    // ensure user is eligible to play good word hunting
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        let speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play Good Word Hunting with extended time?</voice>";
        let repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play Good Word Hunting with extended time?</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart',
        });
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      } else {
        // user not eligible to play, ask if they would like to hear game description
        let speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, it seems you haven't purchased the rights to play Good Word Hunting. Would you like to hear a little bit about this game?</voice>";
        let repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to hear a little bit about Good Word Hunting?</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp',
        });
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      }
    });
  },
};
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
    var movie_id = attributes.movie_id;
    var movie = attributes.movie;
    var year = attributes.year;
    var hint = attributes.hint;
    if (hint == undefined) {
      hint = 1;
    }
    console.log(movie_id);
    // get a random popular movie if this intent is not being repeated
    if (attributes.movie_id == undefined) {
      try {
        let random_movie = await getRandomMovie();
        if (random_movie.results.length > 0) {
          // save variables for random movie
          let random_index = Math.floor(
            Math.random() * random_movie.results.length
          );
          movie_id = random_movie.results[random_index].id;
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
        let random_movie_tagline = await getMovieTagline(movie_id);
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
            movie_id: movie_id,
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
        let random_movie_keywords = await getMovieKeywords(movie_id);
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
            let random_movie_credits = await getMovieCredits(movie_id);
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
              movie_id: movie_id,
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
const HintIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'HintIntent'
    );
  },
  async handle(handlerInput) {
    console.log('HintIntent handler called');
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    // if game is whose tagline, allow for two hints
    if (attributes.type == 'whoseTagline' || attributes.type == 'answer') {
      // first hint, year the movie came out, release year passed along in sessions variables
      if (attributes.hint == 1) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>This movie came out in " +
          attributes.year +
          ". Was that any help? I'll give you a few more seconds to think on it. <break time='4s'/>" +
          'Okay, what would you like to do? Repeat the tagline, get one more hint, or answer.</voice>';
      }
      // second hint, movie top two billed cast members, make api call
      else if (attributes.hint == 2) {
        try {
          let movie_credits = await getMovieCredits(attributes.movie_id);
          let credit_one = movie_credits.cast[0].name;
          let credit_two = movie_credits.cast[1].name;
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>The top two billed people for this movie are <break time='1s'/>'" +
            credit_one +
            "' and '" +
            credit_two +
            "' <break time='1s'/>. With that, I'll give you a few more seconds to think about it. <break time='4s'/>" +
            'Okay, that was the last hint I can give you, what would you like to do? Repeat the tagline or answer.</voice>';
        } catch (error) {
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, an error occurred getting data from The Movie Database for your hint. Would you like to answer?</voice>";
          console.log(error);
        }
      }
      // only two hints allowed, prompt for user to answer
      else {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>I'm sorry, I'm afraid that is all the hints I can give. Would you like to repeat the tagline or answer?</voice>";
      }
      handlerInput.attributesManager.setSessionAttributes({
        type: 'answer',
        movie: attributes.movie,
        movie_id: attributes.movie_id,
        year: attributes.year,
        tagline: attributes.tagline,
        hint: attributes.hint + 1,
        repeat: 'whoseTagline',
      });
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(
          "<voice name='" + VOICE_NAME + "'>Would you like to answer?</voice>"
        )
        .getResponse();
    }
    // if game is good word hunting, secretly allow for no hints
    if (attributes.type == 'goodWordHunting') {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, I can't give you any hints, but I'll give you a few more seconds to think of your answer. <break time='4s'/>" +
        'Okay, what movie are these keywords and cast members associated with?</voice>';
      let attributes = handlerInput.attributesManager.getSessionAttributes();
      let easterEgg = 1;
      easterEgg = easterEgg + attributes.easterEgg;
      // if the user asks for a hint three times, give them the year of the movie
      if (easterEgg == 3) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Okay I give in, this movie came out in " +
          attributes.year +
          ". I hope that helps, I'll give you a few more seconds to think of your answer. <break time='4s'/>" +
          'Okay, what movie are these keywords and cast members associated with?</voice>';
      }
      // but no more hints after that!
      if (easterEgg > 3) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>That is seriously all the hints I am going to give you. However, I'll still give you a few more seconds to think of your final answer. <break time='4s'/>" +
          'Okay, what movie are these keywords and cast members associated with?</voice>';
      }

      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movie_id: attributes.movie_id,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
        easterEgg: easterEgg,
        type: 'goodWordHunting',
        numberNamesNeeded: attributes.numberNamesNeeded,
        repeat: 'goodWordHunting',
        time: attributes.time,
      });
      return handlerInput.responseBuilder
        .addDirective({
          type: 'Dialog.ElicitSlot',
          slotToElicit: 'guess',
          updatedIntent: {
            name: 'GameResultsIntent',
            confirmationStatus: 'NONE',
          },
        })
        .speak(speechText)
        .reprompt("<voice name='" + VOICE_NAME + "'>What movie is it?</voice>")
        .getResponse();
    }
  },
};
const MovieCastIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'MovieCastIntent'
    );
  },
  handle(handlerInput) {
    console.log('MovieCastIntent handler called');
    let numberNamesNeeded =
      handlerInput.requestEnvelope.request.intent.slots.numberNamesNeeded.value;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    // if slot is not a number, tell user to give a number
    if (isNaN(numberNamesNeeded) == true) {
      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movie_id: attributes.movie_id,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
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
        .speak(
          "<voice name='" +
            VOICE_NAME +
            "'>I'm sorry, I'm having trouble understanding your response. From lowest billed to highest, how many names do you think you need to name this film?</voice>"
        )
        .reprompt(
          "<voice name='" +
            VOICE_NAME +
            "'>From lowest billed to highest, how many names do you think you need to name this film?</voice>"
        )
        .getResponse();
    }
    // if slot number is larger than cast size or smaller than zero, tell user to give a correct number
    else if (
      numberNamesNeeded > attributes.cast.length ||
      numberNamesNeeded < 0
    ) {
      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movie_id: attributes.movie_id,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
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
        .speak(
          "<voice name='" +
            VOICE_NAME +
            "'>I'm sorry, the number must be between 0 and " +
            attributes.cast.length +
            '. from lowest billed to highest, how many names do you think you need to name this film?</voice>'
        )
        .reprompt(
          "<voice name='" +
            VOICE_NAME +
            "'>From lowest billed to highest, how many names do you think you need to name this film?</voice>"
        )
        .getResponse();
    } else {
      // speech text if user needs zero names
      if (numberNamesNeeded == 0) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You believe you can name this movie with no cast names give. What is the name of this movie?</voice>";
      }
      // speech text if user needs only one name
      else if (numberNamesNeeded == 1) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You said you need only one name in order to name this movie. That lowest billed name is " +
          attributes.cast[attributes.cast.length - 1] +
          "<break time='1s'/>. " +
          "I'll give you a few more seconds to think of your answer. <break time='4s'/> Okay, what is the name of this movie?</voice>";
      }
      // speech text if user needs all names
      else if (numberNamesNeeded == attributes.cast.length) {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You said you need all " +
          numberNamesNeeded +
          " names in order to name this movie. Those names from lowest to highest billed are <break time='1s'/>";
        let castIndex = attributes.cast.length - 1;
        for (let i = 1; i <= attributes.cast.length; i++) {
          if (i == numberNamesNeeded) {
            speechText +=
              'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
          } else {
            speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
          }
          castIndex--;
        }
        speechText +=
          "With that, I'll give you a few more seconds to think about it. <break time='4s'/> Alright, what movie are these keywords and cast members associated with?</voice>";
      }
      // speech text if user needs in between two and cast length minus one names
      else {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You said you need " +
          numberNamesNeeded +
          ' out of ' +
          attributes.cast.length +
          " names in order to name this movie. Those names from lowest to highest billed are <break time='1s'/>";
        let castIndex = attributes.cast.length - 1;
        for (let i = 1; i <= numberNamesNeeded; i++) {
          if (i == numberNamesNeeded) {
            speechText +=
              'and ' + attributes.cast[castIndex] + ". <break time='1s'/>";
          } else {
            speechText += attributes.cast[castIndex] + ", <break time='1s'/>";
          }
          castIndex--;
        }
        speechText +=
          "With that, I'll give you a few more seconds to think of your answer. <break time='4s'/> Alright, what movie are these keywords and cast members associated with? If you would like to hear the keywords and cast members again say repeat.</voice>";
      }
      // pass along appropriate variables, elicit answer or repeat
      handlerInput.attributesManager.setSessionAttributes({
        cast: attributes.cast,
        movie_id: attributes.movie_id,
        movie: attributes.movie,
        year: attributes.year,
        keywords: attributes.keywords,
        type: 'goodWordHunting',
        numberNamesNeeded: numberNamesNeeded,
        repeat: 'goodWordHunting',
        time: attributes.time,
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
          "<voice name='" +
            VOICE_NAME +
            "'>What movie are these keywords and cast members associated with?</voice>"
        )
        .getResponse();
    }
  },
};
const AnswerIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent'
    );
  },
  handle(handlerInput) {
    console.log('AnswerIntent handler called');
    // answer intent for whose tagline game only
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
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>Alright, what movie is this the tagline for?</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>Any guess is better than nothing.</voice>"
      )
      .getResponse();
  },
};
const GameResultsIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GameResultsIntent'
    );
  },
  handle(handlerInput) {
    console.log('GameResultsIntent handler called');
    let guess = handlerInput.requestEnvelope.request.intent.slots.guess.value;
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    // finalize game results for good word hunting game
    if (attributes.type == 'goodWordHunting') {
      // recap keywords
      let speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Okay, to recap, the keywords for this movie where <break time='1s'/>'";
      for (let i = 0; i < attributes.keywords.length; i++) {
        if (attributes.keywords.length - 1 == i) {
          speechText +=
            'and ' + attributes.keywords[i] + ". <break time='1s'/>";
        } else {
          speechText += attributes.keywords[i] + ", <break time='1s'/>";
        }
      }
      // compare answers
      speechText +=
        "Your guess was, '" +
        guess +
        "'. And the answer is, <break time='1s'/> '" +
        attributes.movie +
        "'. ";
      let numberOfNamesLeft =
        attributes.cast.length - attributes.numberNamesNeeded;
      // give remaining names from highest to lowest billed
      if (numberOfNamesLeft == 1) {
        speechText += ' The remaining name was ' + attributes.cast[0] + '. ';
      }
      if (numberOfNamesLeft == 2) {
        speechText +=
          ' The remaining names from top billed to lowest were ' +
          attributes.cast[0] +
          ' and ' +
          attributes.cast[1] +
          '. ';
      }
      if (numberOfNamesLeft > 2) {
        speechText += ' The remaining names from top billed to lowest were ';
        for (var i = 0; i < numberOfNamesLeft; i++) {
          if (i + 1 == numberOfNamesLeft) {
            speechText += 'and ' + attributes.cast[i] + '. ';
          } else {
            speechText += attributes.cast[i] + ', ';
          }
        }
      }
      // prompt for new game
      handlerInput.attributesManager.setSessionAttributes({
        type: 'goodWordHunting',
      });
      speechText +=
        'Thank you for playing, would you like to play another round?</voice>';
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(
          "<voice name='" +
            VOICE_NAME +
            "'>To play another round, please say 'play Good Word Hunting'.</voice>"
        )
        .getResponse();
    }
    // finalize game results for whose tagline is it anyway
    else {
      let speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Okay, to recap, the tagline was <break time='1s'/>'" +
        attributes.tagline +
        "'<break time='1s'/>. Your guess was, '" +
        guess +
        "'. And the answer is, <break time='1s'/> '" +
        attributes.movie +
        "' <break time='1s'/>. Thank you for playing. Would like to play another round?</voice>";
      handlerInput.attributesManager.setSessionAttributes({
        type: 'whoseTagline',
      });
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(
          "<voice name='" +
            VOICE_NAME +
            "'>To play another round, please say 'play Whose Tagline Is It Anyway'.</voice>"
        )
        .getResponse();
    }
  },
};
const GetTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetTaglineIntent'
    );
  },
  async handle(handlerInput) {
    console.log('GetTaglineIntent handler called');
    let movie = handlerInput.requestEnvelope.request.intent.slots.movie.value;
    let year = handlerInput.requestEnvelope.request.intent.slots.year.value;
    let speechText = '';
    // search for movie based on user input
    try {
      let search_movie = await searchForMovie(movie, year);
      // if a result is found, get tagline for top (closest matched) result
      if (search_movie.results.length > 0) {
        let movie_id = search_movie.results[0].id;
        try {
          let search_movie_tagline = await getMovieTagline(movie_id);
          let tagline = search_movie_tagline.tagline;
          let original_title = search_movie_tagline.original_title;
          let year = search_movie_tagline.release_date;
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>The tagline for " +
            original_title +
            ' from ' +
            year.substring(0, 4) +
            " is <break time='1s'/>" +
            tagline +
            '. </voice>';
        } catch (error) {
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, an error occurred getting data from The Movie Database. Please try again. </voice>";
          console.log(error);
        }
      }
      // if no result found, reprompt user to include the year of the movie after the title
      else {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I was not able to find a match for " +
          movie +
          '. Try including the year after the title by saying ' +
          "get the tagline for 'insert movie' from 'insert year'. </voice>";
      }
    } catch (error) {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, an error occurred getting data from The Movie Database. Please try again. </voice>";
      console.log(error);
    }
    speechText +=
      "<voice name='" +
      VOICE_NAME +
      "'>If you would like to get the tagline for another movie, please say get tagline for 'insert movie'.</voice>";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you would like to get the tagline for another movie, please say get tagline for 'insert movie'.</voice>"
      )
      .getResponse();
  },
};
const GetMovieCastIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetMovieCastIntent'
    );
  },
  async handle(handlerInput) {
    console.log('GetMovieCastIntent handler called');
    let movie = handlerInput.requestEnvelope.request.intent.slots.movie.value;
    let year = handlerInput.requestEnvelope.request.intent.slots.year.value;
    let speechText = '';
    // search for movie based on user input
    try {
      let search_movie = await searchForMovie(movie, year);
      // if a result is found, get credits for top (closest matched) result
      if (search_movie.results.length > 0) {
        let movie_id = search_movie.results[0].id;
        let movie = search_movie.results[0].title;
        let year = search_movie.results[0].release_date;
        try {
          let search_movie_credits = await getMovieCredits(movie_id);
          if (search_movie_credits.cast.length != 0) {
            // if movie has more than 10 credits, only name the top 10 from highest billed to lowest
            if (search_movie_credits.cast.length < 10) {
              speechText =
                "<voice name='" +
                VOICE_NAME +
                "'>There are only " +
                search_movie_credits.cast.length +
                ' cast members for ' +
                movie +
                ' from ' +
                year.substring(0, 4) +
                '. These ' +
                search_movie_credits.cast.length +
                " names, from highest billed to lowest are <break time='1s'/>";
              for (let i = 0; i < search_movie_credits.cast.length; i++) {
                if (i + 1 == search_movie_credits.cast.length) {
                  speechText +=
                    'and ' +
                    search_movie_credits.cast[i].name +
                    ". <break time='1s'/></voice>";
                } else {
                  speechText +=
                    search_movie_credits.cast[i].name + ", <break time='1s'/>";
                }
              }
            }
            // if movie has less than 10 credits, name them all from highest billed to lowest
            else {
              speechText =
                "<voice name='" +
                VOICE_NAME +
                "'>There are over 10 cast members for " +
                movie +
                ' from ' +
                year.substring(0, 4) +
                ". The top 10 billed names, from highest billed to lowest are <break time='1s'/>";
              for (let i = 0; i < 10; i++) {
                if (i + 1 == 10) {
                  speechText +=
                    'and ' +
                    search_movie_credits.cast[i].name +
                    ". <break time='1s'/></voice>";
                } else {
                  speechText +=
                    search_movie_credits.cast[i].name + ", <break time='1s'/>";
                }
              }
            }
          }
        } catch (error) {
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, an error occurred getting data from The Movie Database. Please try again. </voice>";
          console.log(error);
        }
      }
      // if no result found, reprompt user to include the year of the movie after the title
      else {
        speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I was not able to find a match for " +
          movie +
          '. Try including the year after the title by saying ' +
          "get the cast for 'insert movie' from 'insert year'. </voice>";
      }
    } catch (error) {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, an error occurred getting data from The Movie Database. Please try again. </voice>";
      console.log(error);
    }
    speechText +=
      "<voice name='" +
      VOICE_NAME +
      "'>If you would like to get the cast for another movie, please say get cast for 'insert movie'.</voice>";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you would like to get the cast for another movie, please say get cast for 'insert movie'.</voice>"
      )
      .getResponse();
  },
};
const HelpIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    console.log('HelpIntent Handler Called');
    // list help options available
    let speechText =
      "<voice name='" +
      VOICE_NAME +
      "'>For help and information about Whose Tagline Is It Anyway, please say 'help with Whose Tagline Is It Anyway'. " +
      "For help and information about Good Word Hunting, please say 'help with Good Word Hunting'. " +
      "For help and information about getting the tagline for a specific movie, please say 'help with getting movie tagline'. " +
      "And for help and information about getting the cast for a specific movie, please say 'help with getting movie cast'. </voice>";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>What area can I help you with?</voice>"
      )
      .getResponse();
  },
};
const HelpWhoseTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpWhoseTaglineIntent'
    );
  },
  handle(handlerInput) {
    console.log('HelpWhoseTaglineIntent Handler Called');
    // help option explaining how to play Whose Tagline Is It Anyway
    let speechText =
      "<voice name='" +
      VOICE_NAME +
      "'>In Whose Tagline Is It Anyway, you will be given the tagline for a random movie. With that tagline, " +
      'you must do your best to deduce what movie the tagline is associated with. If you are having trouble, you can get up to two hints. The first hint will ' +
      'be the year the movie came out. The second hint will be the top two billed cast members of the movie. After that, you must give your answer. ' +
      'Results then will be compared, and the answer given. And that is how you play Whose Tagline Is It Anyway. Shall we play a quick round?</voice>';
    handlerInput.attributesManager.setSessionAttributes({
      type: 'whoseTagline',
    });
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play a quick round?</voice>"
      )
      .getResponse();
  },
};
const HelpGoodWordHuntingIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpGoodWordHuntingIntent'
    );
  },
  handle(handlerInput) {
    console.log('HelpGoodWordHuntingIntent Handler Called');
    // help option explaining how to play Good Word Hunting
    let speechText =
      "<voice name='" +
      VOICE_NAME +
      "'>Good Word Hunting is an additional game available for purchase. At the start of the game, " +
      'you will be given up to 5 keywords associated with a random movie. With those keywords, you will then be asked how many cast members from ' +
      'lowest billed to highest, would you need to guess what the movie is. With a number given, I will then list off the corresponding number of ' +
      'names, again from lowest billed to highest. However, If you believe you know what the movie is based on just the keywords, you are also ' +
      'welcome to say zero names. After that, you will be prompted to answer. With an answer given, results will be compared and the correct answer ' +
      "given. To learn about playing Good Word Hunting in a group setting, say 'how to play Good Word Hunting in a group setting'. If you are interested in buying Good Word Hunting, please say 'buy Good Word Hunting'.</voice>";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
  },
};
const HelpGoodWordHuntingGroupIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpGoodWordHuntingGroupIntent'
    );
  },
  handle(handlerInput) {
    console.log('HelpGoodWordHuntingGroupIntent Handler Called');
    // help option explaining how to play Good Word Hunting in a group setting
    let speechText =
      "<voice name='" +
      VOICE_NAME +
      "'>Good Word Hunting can also be fun to play in a group setting.  At the start of the game, everyone " +
      'will be given the keywords associated with a random movie. Then, you will be given 20 seconds to bid on who can name the movie with the least amount ' +
      'of names given to them, from lowest billed to highest. With a successful bidder determined, that person will complete the game. If the bidder gets the ' +
      'answer right, add a point. If they get it wrong, deduct a point. Or, instead of subtracting a point, the next bidder gains a point. For example, if ' +
      "someone bids 3 names, and the next bidder doesn't think they can do it with 2. They can then challenge the 3 name bidder to answer, and if they don't " +
      'get it right the person that challenged gets a point. You may bend the rules however you like, the only suggestion I have it to establish a bidding order ' +
      'as to avoid chaos. On top of that, please say yes when prompted if you would like to play with extended time. You will be given 20 seconds to bid on names. ' +
      "To hear this information again, please say 'how to play Good Word Hunting in a group setting'. If you are interested in buying Good Word Hunting, please say 'buy Good Word Hunting'.</voice>";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
  },
};
const HelpGetTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpGetTaglineIntent'
    );
  },
  handle(handlerInput) {
    console.log('HelpGetTaglineIntent Handler Called');
    // help option explaining how to use the ability to get a tagline for any movie
    let speechText =
      "<voice name='" +
      VOICE_NAME +
      "'>You can use this skill to get the tagline of any movie. Simply say 'get tagline for insert movie'. " +
      "Or, you can say 'what is the tagline for insert movie'. If you are having trouble getting the tagline for the right  movie, try appending the year " +
      "the movie came out after the movie title. So, you would say 'what is the tagline for insert movie from insert year movie came out'. " +
      'This skill can not be used during a game. If it is, your current round progress will be lost. If you would like to hear this information again, ' +
      "please say 'help with getting movie tagline'</voice>";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
  },
};
const HelpGetCastIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'HelpGetCastIntent'
    );
  },
  handle(handlerInput) {
    console.log('HelpGetCastIntent Handler Called');
    // help option explaining how to use the ability to get the cast for any movie
    let speechText =
      "<voice name='" +
      VOICE_NAME +
      "'>You can use this skill to get the cast list of any movie. Simply say 'who was in insert movie'. " +
      "Or, you can say 'get cast for insert movie. If you are having trouble getting the cast list for the right movie, try appending the year the movie " +
      "came out after the movie title. So, you would say 'who was in insert movie from insert year movie came out'. This skill can not be used during a " +
      "game. If it is, your current round progress will be lost. If you would like to hear this information again, please say 'help with getting movie cast'</voice>";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
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
            movie_id: attributes.movie_id,
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
            movie_id: attributes.movie_id,
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
const CancelIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
    );
  },
  handle(handlerInput) {
    console.log('CancelIntent Handler Called');
    // cancel intent, exit skill
    return handlerInput.responseBuilder.speak();
  },
};
const StopIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
    );
  },
  handle(handlerInput) {
    console.log('StopIntent Handler Called');
    // stop intent, exit skill
    return handlerInput.responseBuilder.speak();
  },
};
const NoIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    );
  },
  async handle(handlerInput) {
    console.log('YesIntent Handler Called');
    let attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Okay, if you would like more information about this skill's abilities, please say 'help'</voice>";
          break;
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '4s',
          });
          return StartGameIntent.handle(handlerInput);
        default:
          speechText =
            "<voice name='" +
            VOICE_NAME +
            "'>Sorry, I am not sure what you are saying no for. Would you like some help?</voice>";
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText =
        "<voice name='" +
        VOICE_NAME +
        "'>Sorry, I am not sure what you are saying no for. Would you like some help?</voice>";
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(
        "<voice name='" + VOICE_NAME + "'>Would you like some help?</voice>"
      )
      .getResponse();
  },
};
const Fallback = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    console.log('FallbackIntent Handler Called');
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I didn't understand what you said. Please try again.</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>Sorry, I didn't understand what you said. Please try again.</voice>"
      )
      .getResponse();
  },
};
const ShopIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ShopIntent'
    );
  },
  handle(handlerInput) {
    console.log('ShopIntent Handler Called');
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>If you enjoyed playing Whose Tagline Is It Anyway, you may also be interested in Good Word Hunting. " +
          "For more information please say, 'what is Good Word Hunting'.</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>For more information please say, 'what is Good Word Hunting'.</voice>"
      )
      .getResponse();
  },
};
const BuyIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'BuyIntent'
    );
  },
  handle(handlerInput) {
    console.log('BuyIntent Handler Called');
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Connections.SendRequest',
        name: 'Buy',
        payload: {
          InSkillProduct: {
            productId: PRODUCT_ID,
          },
        },
        token: 'correlationToken',
      })
      .getResponse();
  },
};
const BuyResponseIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      handlerInput.requestEnvelope.request.name === 'Buy'
    );
  },
  handle(handlerInput) {
    console.log('BuyResponseIntent Handler Called');
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const productId = handlerInput.requestEnvelope.request.payload.productId;

    return ms
      .getInSkillProducts(locale)
      .then(function handlePurchaseResponse(result) {
        const product = result.inSkillProducts.filter(
          (record) => record.productId === productId
        );
        console.log(`PRODUCT = ${JSON.stringify(product)}`);
        if (handlerInput.requestEnvelope.request.status.code === '200') {
          let speakOutput;
          let repromptOutput;
          switch (handlerInput.requestEnvelope.request.payload.purchaseResult) {
            case 'ACCEPTED':
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Thank you for your purchase! You now have full access to Good Word Hunting. Would you like to play a game right now?</voice>";
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Would you like to play a game right now?</voice>";
              handlerInput.attributesManager.setSessionAttributes({
                type: 'goodWordHunting',
              });
              break;
            case 'DECLINED':
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Thank you for your interest in buying Good Word Hunting. Shall we continue playing Whose Tagline Is It Anyway?</voice>";
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Shall we continue playing Whose Tagline Is It Anyway?</voice>";
              handlerInput.attributesManager.setSessionAttributes({
                type: 'whoseTagline',
              });
              break;
            case 'ALREADY_PURCHASED':
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>It appears you already have access to play Good Word Hunting. Would you like to play a game right now?</voice>";
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Would you like to play a game right now?</voice>";
              handlerInput.attributesManager.setSessionAttributes({
                type: 'goodWordHunting',
              });
              break;
            default:
              console.log(
                `unhandled purchaseResult: ${handlerInput.requestEnvelope.payload.purchaseResult}`
              );
              speakOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Something unexpected happened during your purchase, thank you for your interest in buying Good Word Hunting. " +
                'Perhaps re-try the transaction in a bit. Shall we continue playing Whose Tagline Is It Anyway in the meantime?</voice>';
              repromptOutput =
                "<voice name='" +
                VOICE_NAME +
                "'>Shall we continue playing Whose Tagline Is It Anyway in the meantime?</voice>";
              break;
          }
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
        }
        console.log(
          'Connections.Response indicated failure. error: ${handlerInput.requestEnvelope.request.status.message}'
        );
        return handlerInput.responseBuilder
          .speak(
            'There was an error handling your purchase request. Please try again or contact us for help.'
          )
          .getResponse();
      });
  },
};
const RefundIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RefundIntent'
    );
  },
  handle(handlerInput) {
    console.log('RefundIntent Handler Called');
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Connections.SendRequest',
        name: 'Cancel',
        payload: {
          InSkillProduct: {
            productId: PRODUCT_ID,
          },
        },
        token: 'correlationToken',
      })
      .getResponse();
  },
};

const PurchasedIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'PurchasedIntent'
    );
  },
  handle(handlerInput) {
    console.log('PurchasedIntent Handler Called');
    // check if user is eligible to play good word hunting
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    return ms.getInSkillProduct(locale, PRODUCT_ID).then(function (result) {
      if (result.entitled == 'ENTITLED') {
        // set game type to good word hunting, call start game intent
        let speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You have purchased the rights to play Good Word Hunting. Would you like to play a quick game?</voice>";
        let repromptText =
          "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play a game of Good Word Hunting?</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingStart',
        });
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(repromptText)
          .getResponse();
      } else {
        // user not eligible to play, ask if they would like to hear game description
        let speechText =
          "<voice name='" +
          VOICE_NAME +
          "'>You have not made any in-skill purchases.</voice>";
        handlerInput.attributesManager.setSessionAttributes({
          type: 'goodWordHuntingHelp',
        });
        return handlerInput.responseBuilder.speak(speechText);
      }
    });
  },
};

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
    HelpGoodWordHuntingIntent,
    HelpGoodWordHuntingGroupIntent,
    HelpGetTaglineIntent,
    HelpGetCastIntent,
    StopIntent,
    CancelIntent,
    NoIntent,
    Fallback,
    ShopIntent,
    BuyIntent,
    BuyResponseIntent,
    RefundIntent,
    RefundResponseHandler,
    PurchasedIntent,
    UnhandledHandler
  )
  .withSkillId('amzn1.ask.skill.9b659d16-b8f7-4401-ac19-d4d86a2b59b7')
  .withApiClient(new Alexa.DefaultApiClient())
  .addErrorHandlers(UnhandledHandler)
  .lambda();
