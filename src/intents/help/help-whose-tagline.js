const { VOICE_CLOSE, VOICE_OPEN } = require('../../consts');
const {
  HELP_WHOSE_TAGLINE_INTENT,
  INTENT_REQUEST,
} = require('../../consts/intents');

export const HelpWhoseTaglineIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.type === INTENT_REQUEST &&
      input.intent.name === HELP_WHOSE_TAGLINE_INTENT
    );
  },
  handle(handlerInput) {
    // help option explaining how to play Whose Tagline Is It Anyway
    return handlerInput.responseBuilder
      .speak(
        VOICE_OPEN +
          'In Whose Tagline Is It Anyway, you will be given the tagline for a random movie. ' +
          'With that tagline, you must do your best to deduce what movie the tagline ' +
          'is associated with. If you are having trouble, you can get up to two hints. ' +
          'The first hint will be the year the movie came out. The second hint will be ' +
          'the top two billed cast members of the movie. After that, you must give your answer. ' +
          'Results then will be compared, and the answer given. And that is how you ' +
          'play Whose Tagline Is It Anyway. Shall we play a quick round?' +
          VOICE_CLOSE
      )
      .reprompt(
        VOICE_OPEN + 'Would you like to play a quick round?' + VOICE_CLOSE
      )
      .getResponse();
  },
};
