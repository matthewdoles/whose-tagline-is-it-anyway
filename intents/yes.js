import { VOICE_CLOSE, VOICE_OPEN } from '../consts';
import { INTENT_REQUEST, YES_INTENT } from '../consts/intents';
import { AnswerIntent } from './answer';
import { GoodWordHuntingIntent } from './good-word-hunting';
import { HelpIntent } from './help/help';
import { HelpGWHIntent } from './help/help-gwh';
import { StartGameIntent } from './start-game';
import { WhoseTaglineIntent } from './whose-tagline';

export const YesIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return input.type === INTENT_REQUEST && input.intent.name === YES_INTENT;
  },
  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speechText = '';
    let unknownResponse =
      VOICE_OPEN +
      'Sorry, I am not sure what you are saying yes for. Would you like some help?' +
      VOICE_CLOSE;

    if (attributes.type) {
      switch (attributes.type) {
        case 'whoseTagline':
          return WhoseTaglineIntent.handle(handlerInput);
        case 'goodWordHunting':
          return GoodWordHuntingIntent.handle(handlerInput);
        case 'goodWordHuntingStart':
          await handlerInput.attributesManager.setSessionAttributes({
            type: 'goodWordHunting',
            time: '20s',
          });
          return StartGameIntent.handle(handlerInput);
        case 'goodWordHuntingHelp':
          return HelpGWHIntent.handle(handlerInput);
        case 'answer':
          return AnswerIntent.handle(handlerInput);
        case 'help':
          return HelpIntent.handle(handlerInput);
        default:
          speechText = unknownResponse;
          handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
      }
    } else {
      speechText = unknownResponse;
      handlerInput.attributesManager.setSessionAttributes({ type: 'help' });
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(VOICE_OPEN + 'Would you like some help?' + VOICE_CLOSE)
      .getResponse();
  },
};
