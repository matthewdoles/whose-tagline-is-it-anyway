import { VOICE_NAME } from '../../consts';

export const HelpGWHIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpGoodWordHuntingIntent'
    );
  },
  handle(handlerInput) {
    // help option explaining how to play Good Word Hunting
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>Good Word Hunting is an additional game available for purchase. At the start of the game, " +
          'you will be given up to 5 keywords associated with a random movie. With those keywords, you will then be asked how many cast members from ' +
          'lowest billed to highest, would you need to guess what the movie is. With a number given, I will then list off the corresponding number of ' +
          'names, again from lowest billed to highest. However, If you believe you know what the movie is based on just the keywords, you are also ' +
          'welcome to say zero names. After that, you will be prompted to answer. With an answer given, results will be compared and the correct answer ' +
          "given. To learn about playing Good Word Hunting in a group setting, say 'how to play Good Word Hunting in a group setting'. If you are interested in buying Good Word Hunting, please say 'buy Good Word Hunting'.</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
  },
};
