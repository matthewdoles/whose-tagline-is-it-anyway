# whose-tagline-is-it-anyway

Alexa Skill Store Page: [Whose Tagline Is It Anyway](https://www.amazon.com/Whose-Tagline-Is-It-Anyway/dp/B07SW6MZLZ)

Invocation: whose tagline is it anyway

### Skill Description

In Whose Tagline Is It Anyway, you will be given the tagline for a random movie from a pool of 1,500 semi-popular movies. From that, you must deduce what movie the tagline is for. There is also an additional in-skill product: Good Word Hunting. In this game, you will be given up to 5 keywords associated with a random movie. With those keywords, you will then be asked how many cast members from lowest billed to highest would you need to guess what the movie is.

### Design

#### API

The pool of 1,500 or so movies are retrieved using [The Movie Database](https://www.themoviedb.org/?language=en-US) free API. In order to avoid retrieving obscure or little known movies, a filter was applied where the vote count (number of user ratings) was greater than 1,500.

#### Launch Request Handler

On skill launch, the [LaunchRequestHandler](./handlers/launch-request.js) will check if the user is entitled to the Good Word Hunting prdocut. If the user is not entitled, the skill will ask the user if they would like to play Whose Tagline Is It Anyway. If the user is entitled, both Whose Tagline Is It Anyway and Good Word Hunting are offered as options.

#### Whose Tagline Intent

The [WhoseTaglineIntent](./intents/whose-tagline.js) sets the game type to 'whoseTagline' in the session variables and triggers the StartGameIntent.

#### Good Word Hunting Intent

The [GoodWordHuntingIntent](./intents/good-word-hunting.js) first checks if the user is entitled to the Good Word Hunting prdocut. If the user is not entitled to the product, they are informed and asked if they would like to hear more about the game. If the user is entitled, they are asked if they would like to play with extended time to answer (20s) or not (4s). Both repsonses will eventually trigger the StartGameIntent.

#### Standard Intents

[CancelIntent](./intents/standard/cancel.js): Invocated if the user says 'cancel'. Exits the skill.

[FallbackIntent](./intents/standard/fallback.js): Invocated if the user gives a response that was not handled by any intents. Informs the user their response was not understood and asks them to try again.

[NoIntent](./intents/standard/no.js): Invocated if the user says 'no'. The user may be prompted yes or no questions, the NoIntent triggers the next correct intent based upon the type which was set by the intent that asksed said yes or no question. Most scenarios will trigger an action that asks if the user would like some help.

[StopIntent](./intents/standard/stop.js): Invocated if the user says 'stop'. Exits the skill.

[YesIntent](./intents/standard/yes.js): Invocated if the user says 'yes'. The user may be prompted yes or no questions, the YesIntent triggers the next correct intent based upon the type which was set by the intent that asksed said yes or no question. Most scenarios will trigger an action that starts a game of Whose Tagline Is It Anyway or Good Word Hunting.
