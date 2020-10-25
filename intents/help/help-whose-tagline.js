import { VOICE_NAME } from '../../consts';

export const HelpWhoseTaglineIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpWhoseTaglineIntent'
    );
  },
  handle(handlerInput) {
    // help option explaining how to play Whose Tagline Is It Anyway
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>In Whose Tagline Is It Anyway, you will be given the tagline for a random movie. With that tagline, " +
          'you must do your best to deduce what movie the tagline is associated with. If you are having trouble, you can get up to two hints. The first hint will ' +
          'be the year the movie came out. The second hint will be the top two billed cast members of the movie. After that, you must give your answer. ' +
          'Results then will be compared, and the answer given. And that is how you play Whose Tagline Is It Anyway. Shall we play a quick round?</voice>'
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>Would you like to play a quick round?</voice>"
      )
      .getResponse();
  },
};
