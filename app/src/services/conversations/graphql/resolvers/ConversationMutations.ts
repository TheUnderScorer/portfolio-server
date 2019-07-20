import Conversation from '../../models/Conversation';
import { Arg, Ctx, ID, Mutation, Resolver } from 'type-graphql';
import ConversationInput from '../inputs/ConversationInput';
import Context from '../../../../types/graphql/Context';
import events from '../../../../events';
import { getUser } from '../../../user/graphql/authorization';
import DeleteConversationResult from '../objects/DeleteConversationResult';

@Resolver( Conversation )
export default class ConversationMutations
{
    @Mutation( () => Conversation )
    public async createConversation(
        @Arg( 'conversationInput' ) { title }: ConversationInput,
        @Ctx() { req, loaders }: Context
    ): Promise<Conversation>
    {
        const author = await getUser( req, loaders.users );

        const conversation = await Conversation.create( {
            title,
        } );
        conversation.author = Promise.resolve( author );

        await conversation.save();

        loaders.conversations.prime( conversation.id.toString(), conversation );

        events.emit( 'app.conversations.created', conversation, { req, loaders } );

        return conversation;
    }

    @Mutation( () => Conversation )
    public async updateConversation(
        @Arg( 'id', () => ID ) id: number,
        @Arg( 'conversationInput' ) input: ConversationInput,
        @Ctx() { req, loaders }: Context
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

        events.emit( 'app.conversations.updated', conversation, { req, loaders } );

        return conversation;
    }

    @Mutation( () => DeleteConversationResult )
    public async deleteConversation(
        @Arg( 'id', () => ID ) id: number,
        @Ctx() { req, loaders }: Context
    ): Promise<DeleteConversationResult>
    {
        const user = await getUser( req, loaders.users );

        const conversation = await Conversation.findOneOrFail( id, {
            where: {
                author: user.id
            }
        } );
        await conversation.remove();

        return {
            result: true,
        };
    }

}
