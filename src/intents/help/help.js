const { VOICE_CLOSE, VOICE_OPEN } = require('../../consts');
const { HELP_INTENT, INTENT_REQUEST } = require('../../consts/intents');

export const HelpIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.request.type === INTENT_REQUEST && input.intent.name === HELP_INTENT
    );
  },
  handle(handlerInput) {
    // list help options available
    return handlerInput.responseBuilder
      .speak(
        VOICE_OPEN +
          'For help and information about Whose Tagline Is It Anyway, ' +
          "please say 'help with Whose Tagline Is It Anyway'. " +
          'For help and information about Good Word Hunting, ' +
          "please say 'help with Good Word Hunting'. " +
          'For help and information about getting the tagline for a specific movie, ' +
          "please say 'help with getting movie tagline'. " +
          'And for help and information about getting the cast for a specific movie, ' +
          "please say 'help with getting movie cast'." +
          VOICE_CLOSE
      )
      .reprompt(VOICE_OPEN + 'What area can I help you with?' + VOICE_CLOSE)
      .getResponse();
  },
};
