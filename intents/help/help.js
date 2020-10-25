import { VOICE_NAME } from '../../consts';

export const HelpIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    // list help options available
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>For help and information about Whose Tagline Is It Anyway, please say 'help with Whose Tagline Is It Anyway'. " +
          "For help and information about Good Word Hunting, please say 'help with Good Word Hunting'. " +
          "For help and information about getting the tagline for a specific movie, please say 'help with getting movie tagline'. " +
          "And for help and information about getting the cast for a specific movie, please say 'help with getting movie cast'. </voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>What area can I help you with?</voice>"
      )
      .getResponse();
  },
};
