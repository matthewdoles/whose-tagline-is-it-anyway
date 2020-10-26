import { VOICE_CLOSE, VOICE_NAME, VOICE_OPEN } from '../../consts';
import { HELP_GWH_GROUP_INTENT, INTENT_REQUEST } from '../../consts/intents';

export const HelpGWHGroupIntent = {
  canHandle(handlerInput) {
    const input = handlerInput.requestEnvelope.request;
    return (
      input.request.type === INTENT_REQUEST &&
      input.intent.name === HELP_GWH_GROUP_INTENT
    );
  },
  handle(handlerInput) {
    // help option explaining how to play Good Word Hunting in a group setting
    return handlerInput.responseBuilder
      .speak(
        VOICE_OPEN +
          'Good Word Hunting can also be fun to play in a group setting. ' +
          'At the start of the game, everyone will be given the keywords associated ' +
          'with a random movie. Then, you will be given 20 seconds to bid on who can ' +
          'name the movie with the least amount of names given to them, from lowest ' +
          'billed to highest. With a successful bidder determined, that person will ' +
          'complete the game. If the bidder gets the answer right, add a point. ' +
          'If they get it wrong, deduct a point. Or, instead of subtracting a point, ' +
          'the next bidder gains a point. For example, if someone bids 3 names, and ' +
          "the next bidder doesn't think they can do it with 2. They can then challenge " +
          "the 3 name bidder to answer, and if they don't get it right the person " +
          'that challenged gets a point. You may bend the rules however you like, ' +
          'the only suggestion I have it to establish a bidding order as to avoid chaos. ' +
          'On top of that, please say yes when prompted if you would like to play' +
          'with extended time. You will be given 20 seconds to bid on names. ' +
          "To hear this information again, please say 'how to play Good Word Hunting " +
          "in a group setting'. If you are interested in buying Good Word Hunting, " +
          "please say 'buy Good Word Hunting'." +
          VOICE_CLOSE
      )
      .reprompt(
        VOICE_OPEN + "If you need help, please say 'help'." + VOICE_CLOSE
      )
      .getResponse();
  },
};
