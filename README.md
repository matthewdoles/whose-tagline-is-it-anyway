# whose-tagline-is-it-anyway

[![Build Status](https://travis-ci.com/matthewdoles/whose-tagline-is-it-anyway.svg?branch=master)](https://travis-ci.com/matthewdoles/whose-tagline-is-it-anyway) [![Coverage Status](https://coveralls.io/repos/github/matthewdoles/whose-tagline-is-it-anyway/badge.svg)](https://coveralls.io/github/matthewdoles/whose-tagline-is-it-anyway)

<img src="https://images-na.ssl-images-amazon.com/images/I/61rJ1AiwT+L.png" alt="SkillLogo" width="250"/>

Alexa Skill Store Page: [Whose Tagline Is It Anyway](https://www.amazon.com/Whose-Tagline-Is-It-Anyway/dp/B07SW6MZLZ)

Invocation: whose tagline is it anyway

### Skill Description

In Whose Tagline Is It Anyway, you will be given the tagline for a random movie from a pool of aroundd 1,500 semi-popular movies. With that, you must simply deduce what movie the tagline is for.

Additionally, there is also a in-skill product availabe for purchase: Good Word Hunting. In this game, you will be given up to 5 keywords associated with a random movie. With those keywords, you will then be asked how many of the top 10 cast members, from lowest billed to highest, you would need to then guess what the movie is.

### Design

#### API

The pool of 1,500 or so movies are retrieved using [The Movie Database](https://www.themoviedb.org/?language=en-US) free API. In order to avoid retrieving obscure or little known movies, a filter was applied where the vote count (number of user ratings) was greater than 1,500.

#### Deployment

There is a Github Action to deploy the code to a Lambda function. The runtime environment of the Lambda function is currently Node.js 12.x. This particular version (and all currently available versions) struggles with more advanced ECMAScript flavors of JavaScript like ES6 - thus, Babel was introduced to convert the code to ES5 before zipping it up and deploying it.

#### Testing

Unit tests were written using the [Alexa Skill Test Framework](https://www.npmjs.com/package/alexa-skill-test-framework). Given the in-skill product, it is hard to achieve 100% code coverage since the transaction itself is securely completed on Amazon's end. Though purchasing and refunding the product was tested using the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask). On top of that, as a skill with a purchasable product - all scenarios were tested by the Amazon Alexa team when submitted for publication.

#### Launch Request Handler

On skill launch, the [LaunchRequestHandler](./src/handlers/launch-request.js) will check if the user is entitled to the Good Word Hunting prdocut. If the user is not entitled, the skill will ask the user if they would like to play Whose Tagline Is It Anyway. If the user is entitled, both Whose Tagline Is It Anyway and Good Word Hunting are offered as options.

#### Whose Tagline Intent

The [WhoseTaglineIntent](./src/intents/whose-tagline.js) sets the game type to 'whoseTagline' in the session variables and triggers the StartGameIntent.

#### Good Word Hunting Intent

The [GoodWordHuntingIntent](./src/intents/good-word-hunting.js) first checks if the user is entitled to the Good Word Hunting prdocut. If the user is not entitled to the product, they are informed and asked if they would like to hear more about the game. If the user is entitled, they are asked if they would like to play with extended time to answer (20s) or not (4s). Both repsonses will eventually trigger the StartGameIntent.

#### Start Game Intent

The [StartGameIntent](./src/intents/start-game.js) is invoked when starting a game of either Whose Tagline Is It Anyway or Good Word Hunting. The first thing the intent will do is check to see if there is a movie in the session attributes (intent may be repeated, thus may already have a movie). If no movie found in session attributes, will make a callout to retrieve a random movie. If the game is Whose Tagline Is It Anyway, the intent will give the random movie's tagline then prompt the user if they would like it repeated, a hint, or to answer.

If the game is Good Word Hunting, the game will start by giving 5 keywords to describe the random movie (movie may have less than 5). After that, the user will be asked how many out of 10 names from lowest billed to highest they think they would need to guess the movie (movie may have less than 10 cast members, logic in place for such conditions). With a number given, the [MovieCastIntent](./src/intents/movie-cast.js) is invoked for the next phase of the game.

#### Movie Cast Intent

The [MovieCastIntent](./src/intents/movie-cast.js) is used in the second phase of a Good Word Hunting game. The first thing the intent will check is for a valid number guess, if their response is invalid the user is prompted to give a number. With a valid number, the requested number of names from lowest billed to highest will be given. After that, the user is prompted whether they would like the keywords and cast repeated or to answer.

#### Hint Intent

The [HintIntent](./src/intents/hint.js) is invoked upon user request during a game of either a Whose Tagline Is It Anyway or Good Word Hunting. If the game is Whose Tagline Is It Anyway, the user is first given the year the movie came out. After that, the user is aked if they would like to repeat the tagline, get one more hint, or answer. If the user request one more hint, they are given the top two billed cast members of the movie. Then once again, they are if they would like the tagline repeated or answer. If the user tries to answer, the intent replies that no more hints can be given and prompt whether they would like the tagline repeated or answer.

If the game is Good Word Hunting, no hints are given. However as a easter egg, if the user asks for a hint three times, the year the movie came out is given. After that, no more hints are given and the user is prompted whether they would like to repeat the keywords and cast or answer.

#### Repeat Intent

The [RepeatIntent](./src/intents/repeat.js) is invoked upon user request during a game of either a Whose Tagline Is It Anyway or Good Word Hunting. If the game is Whose Tagline Is It Anyway, the [StartGameIntent](./src/intents/start-game.js) is repeated and the user is asked if they would like to repeat the tagline, get a hint, or answer. If the game is Good Word Hunting, the keywords are given again and the requested number of cast memebers are given again. After that, the user is given some more time then requested to answer.

#### Answer Intent

The [AnswerIntent](./src/intents/answer.js) is invoked only when a user request to answer during a game of Whose Tagline Is It Anyway. The intent simply asks the user what movie the tagline is for, saves the user's answer in a guess slot, then triggers the [GameResultsIntent](./src/intents/game-results.js) to compare the guess with the results.

#### Game Results Intent

The [GameResultsIntent](./src/intents/game-results.js) is the last intent in the flow of either a Whose Tagline Is It Anyway or Good Word Hunting game. If the game type is Whose Tagline Is It Anyway, the intent will recap the game by giving the tagline one more time, saying the users's guess, and then giving the correct movie. After recapping, the user will be asked if they like to play another round.

If the game type is Good Word Hunting, the intent will recap the game by giving the keyowrds, the number of cast memebers they asked for, their guess, and then finally the correct movie. After that the remaining cast names are given and then the user is asked if they would like to play another round.

#### Get Tagline & Get Movie Cast Intent

The [GetTaglineIntent](./src/intents/get-tagline.js) and [GetMovieCastIntent](./src/intents/get-movie-cast.js) allows the user to get the tagline or cast for any provided movie. The intent is invoked when a user says "get the tagline/cast for 'insert movie' from 'insert year'". Only the the movie slot is required - the year slot can be optionally given for occurences where two or more movies share the same title ([Examples](https://screenrant.com/movies-same-name-definitely-not-same-movie/)).

#### Standard Intents

[CancelIntent](./src/intents/standard/cancel.js): Invoked if the user says 'cancel'. Exits the skill.

[FallbackIntent](./src/intents/standard/fallback.js): Invoked if the user gives a response that was not handled by any intents. Informs the user their response was not understood and asks them to try again.

[NoIntent](./src/intents/standard/no.js): Invoked if the user says 'no'. The user may be prompted yes or no questions, the NoIntent triggers the next correct intent based upon the type which was set by the intent that asksed said yes or no question. Most scenarios will trigger an action that asks if the user would like some help.

[StopIntent](./src/intents/standard/stop.js): Invoked if the user says 'stop'. Exits the skill.

[YesIntent](./src/intents/standard/yes.js): Invoked if the user says 'yes'. The user may be prompted yes or no questions, the YesIntent triggers the next correct intent based upon the type which was set by the intent that asksed said yes or no question. Most scenarios will trigger an action that starts a game of Whose Tagline Is It Anyway or Good Word Hunting.

#### Shop Intents & Handlers

[BuyIntent](./src/intents/shop/buy.js): Invoked if the user says 'buy'. Starts a transaction with Amazon to buy the Good Word Hunting product. Transaction is handled entirely on Amazon's end.

[BuyResponseHandler](./src/handlers/buy-response.js): Invoked after the user comes back from a transaction to buy. Gives response based upon whether the transaction was successful, declined, or alredy purchased.

[PurchasedIntent](./src/intents/shop/purchased.js): Invoked if the user says 'purchased'. Checks if the user has purchased and is entitled to play Good Word Hunting. If they are, confirms entitlement and asks if the user would like to play a game. Otherwise, informs the user they have not made any in-skill purchase.

[RefundIntent](./src/intents/shop/refund.js): Invoked if the user says 'refund'. Starts a transaction with Amazon to refund the Good Word Hunting product. Transaction is handled entirely by Amazon.

[RefundResponseHandler](./src/handlers/refund-response.js): Invoked after the user comes back from a transaction to refund. Gives response based upon whether the transaction was successful or the user was not previously entitled to the product.

[ShopIntent](./src/intents/shop/shop.js): Invoked after the user says 'shop'. Informs the user they can buy the extra game mode (Good Word Hunting) and how they can learn more about this game.

#### Help Intents

[HelpGetCastIntent](./src/intents/help/help-get-cast.js): Invoked if the user says 'help with getting movie cast'. Instructs the user how they can get the cast for any given movie.

[HelpGetTaglineIntent](./src/intents/help/help-get-tagline.js): Invoked if the user says 'help with getting movie tagline'. Instructs the user how they can get the tagline for any given movie.

[HelpGWHIntent](./src/intents/help/help-gwh.js): Invoked if the user says 'help with Good Word Hunting'. Walks the user through how to play Good Word Hunting. Also informs the user that the game can be played in a group setting and how to learn about it.

[HelpGWHGroupIntent](./src/intents/help/help-gwh-group.js): Invoked if the user says 'how to play Good Word Hunting in a group setting'. Walks the user through how to play Good Word Hunting in a group setting.

[HelpWhoseTaglineIntent](./src/intents/help/help-whose-tagline.js): Invoked if the user says 'help with Whose Tagline Is It Anyway'. Walks the user through how to play Whose Tagline Is It Anyway.

[HelpIntent](./src/intents/help/help.js): Standard intent invocated if the user says 'help'. Responds with what features they can learn about and what to say to invoke the above help intents.
