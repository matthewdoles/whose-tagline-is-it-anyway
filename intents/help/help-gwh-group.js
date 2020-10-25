import { VOICE_NAME } from '../../consts';

export const HelpGWHGroupIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name ===
        'HelpGoodWordHuntingGroupIntent'
    );
  },
  handle(handlerInput) {
    // help option explaining how to play Good Word Hunting in a group setting
    return handlerInput.responseBuilder
      .speak(
        "<voice name='" +
          VOICE_NAME +
          "'>Good Word Hunting can also be fun to play in a group setting.  At the start of the game, everyone " +
          'will be given the keywords associated with a random movie. Then, you will be given 20 seconds to bid on who can name the movie with the least amount ' +
          'of names given to them, from lowest billed to highest. With a successful bidder determined, that person will complete the game. If the bidder gets the ' +
          'answer right, add a point. If they get it wrong, deduct a point. Or, instead of subtracting a point, the next bidder gains a point. For example, if ' +
          "someone bids 3 names, and the next bidder doesn't think they can do it with 2. They can then challenge the 3 name bidder to answer, and if they don't " +
          'get it right the person that challenged gets a point. You may bend the rules however you like, the only suggestion I have it to establish a bidding order ' +
          'as to avoid chaos. On top of that, please say yes when prompted if you would like to play with extended time. You will be given 20 seconds to bid on names. ' +
          "To hear this information again, please say 'how to play Good Word Hunting in a group setting'. If you are interested in buying Good Word Hunting, please say 'buy Good Word Hunting'.</voice>"
      )
      .reprompt(
        "<voice name='" +
          VOICE_NAME +
          "'>If you need help, please say 'help'.</voice>"
      )
      .getResponse();
  },
};
