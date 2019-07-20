import Conversation from '../../models/Conversation';
import { Arg, Ctx, ID, Mutation, Publisher, PubSub, Resolver } from 'type-graphql';
import ConversationInput from '../inputs/ConversationInput';
import Context from '../../../../types/graphql/Context';
import { getUser } from '../../../user/graphql/authorization';
import DeleteConversationResult from '../objects/DeleteConversationResult';
import { Subscriptions } from '../../../../types/graphql/Subscriptions';

@Resolver( Conversation )
export default class ConversationMutations
{
    @Mutation( () => Conversation )
    public async createConversation(
        @Arg( 'conversationInput' ) { title }: ConversationInput,
        @Ctx() { req, loaders }: Context,
        @PubSub( Subscriptions.NewConversation ) publish: Publisher<Conversation>
    ): Promise<Conversation>
    {
        const author = await getUser( req, loaders.users );

        const conversation = await Conversation.create( {
            title,
        } );
        conversation.author = Promise.resolve( author );

        await conversation.save();

        loaders.conversations.prime( conversation.id.toString(), conversation );

        await publish( conversation );

        return conversation;
    }

    @Mutation( () => Conversation )
    public async updateConversation(
        @Arg( 'id', () => ID ) id: number,
        @Arg( 'conversationInput' ) input: ConversationInput,
        @Ctx() { req, loaders }: Context,
        @PubSub( Subscriptions.ConversationUpdated ) publish: Publisher<Conversation>
    ): Promise<Conversation>
    {
        const user = await getUser( req, loaders.users );

        let conversation = await Conversation.findOneOrFail( id, {
            where: {
                author: user.id
            }
        } );
        conversation = Object.assign( conversation, input );

        loaders.conversations
            .clear( conversation.id.toString() )
            .prime( conversation.id.toString(), conversation );

        await conversation.save();

        await publish( conversation );

        return conversation;
    }

    @Mutation( () => DeleteConversationResult )
    public async deleteConversation(
        @Arg( 'id', () => ID ) id: number,
        @Ctx() { req, loaders }: Context,
        @PubSub( Subscriptions.ConversationDeleted ) publish: Publisher<Conversation>
    ): Promise<DeleteConversationResult>
    {
        const user = await getUser( req, loaders.users );

        const conversation = await Conversation.findOneOrFail( id, {
            where: {
                author: user.id
            }
        } );

        await publish( conversation );

        await conversation.remove();

        return {
            result: true,
        };
    }

}
