import Conversation from '../../models/Conversation';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import ConversationInput from '../inputs/ConversationInput';
import Context from '../../../../types/graphql/Context';
import User from '../../../user/models/User';

@Resolver( Conversation )
export default class ConversationMutations
{
    @Mutation( () => Conversation )
    public async createConversation(
        @Arg( 'conversationInput' ) { title, authorID }: ConversationInput,
        @Ctx() { req, loaders }: Context
    ): Promise<Conversation>
    {
        const author = await User.findOne( authorID );

        const conversation = await Conversation.create( {
            title,
            author: Promise.resolve( author )
        } );
        await conversation.save();

        return conversation;
    }

}
