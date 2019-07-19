import Conversation from '../../models/Conversation';
import Context from '../../../../types/graphql/Context';

export default async ( parent, { userID, conversation: input }, { loaders }: Context ) =>
{
    const user = await loaders.users.load( userID );

    const conversation = Conversation.create( { ...input, user } );
    await conversation.save();

    return conversation;
}
