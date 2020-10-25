import { VOICE_NAME } from '../consts';

export const GameResultsIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GameResultsIntent'
    );
  },
  handle(handlerInput) {
    const guess = handlerInput.requestEnvelope.request.intent.slots.guess.value;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

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
      const numberOfNamesLeft =
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
        for (let i = 0; i < numberOfNamesLeft; i++) {
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
