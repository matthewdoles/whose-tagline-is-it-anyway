import { VOICE_NAME } from '../../consts';

export const HelpGetTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpGetTaglineIntent'
    );
  },
  handle(handlerInput) {
    // help option explaining how to use the ability to get a tagline for any movie
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>You can use this skill to get the tagline of any movie. Simply say 'get tagline for insert movie'. " +
          "Or, you can say 'what is the tagline for insert movie'. If you are having trouble getting the tagline for the right  movie, try appending the year " +
          "the movie came out after the movie title. So, you would say 'what is the tagline for insert movie from insert year movie came out'. " +
          'This skill can not be used during a game. If it is, your current round progress will be lost. If you would like to hear this information again, ' +
          "please say 'help with getting movie tagline'</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
  },
};
