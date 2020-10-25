import { VOICE_NAME } from '../../consts';

export const HelpGetCastIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'HelpGetCastIntent'
    );
  },
  handle(handlerInput) {
    // help option explaining how to use the ability to get the cast for any movie
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>You can use this skill to get the cast list of any movie. Simply say 'who was in insert movie'. " +
          "Or, you can say 'get cast for insert movie. If you are having trouble getting the cast list for the right movie, try appending the year the movie " +
          "came out after the movie title. So, you would say 'who was in insert movie from insert year movie came out'. This skill can not be used during a " +
          "game. If it is, your current round progress will be lost. If you would like to hear this information again, please say 'help with getting movie cast'</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
  },
};
