import Conversation from '../../models/Conversation';
import { Arg, Authorized, Ctx, ID, Mutation, Publisher, PubSub, Resolver, UseMiddleware } from 'type-graphql';
import ConversationInput from '../inputs/ConversationInput';
import Context from '../../../../types/graphql/Context';
import DeleteConversationResult from '../objects/DeleteConversationResult';
import { Subscriptions } from '../../../../types/graphql/Subscriptions';
import { ConversationStatuses } from '../../types/ConversationInterface';
import { Actions } from '../../../../types/graphql/Actions';
import attachCurrentUser from '../../../user/graphql/middlewares/attachCurrentUser';

@Resolver( Conversation )
export default class ConversationMutations
{

    @UseMiddleware( attachCurrentUser )
    @Authorized( { action: Actions.CreateConversation } )
    @Mutation( () => Conversation )
    public async createConversation(
        @Arg( 'conversationInput', { nullable: true } ) { title = '' }: ConversationInput = {},
        @Ctx() { req, loaders, currentUser: author }: Context,
        @PubSub( Subscriptions.NewConversation ) publish: Publisher<Conversation>
    ): Promise<Conversation>
    {
        const conversation = await Conversation.create( {
            title,
        } );
        conversation.author = Promise.resolve( author );

        await conversation.save();

        loaders.conversations.prime( conversation.id.toString(), conversation );

        await publish( conversation );

        return conversation;
    }

    @UseMiddleware( attachCurrentUser )
    @Mutation( () => Conversation )
    public async updateConversation(
        @Arg( 'id', () => ID ) id: number,
        @Arg( 'conversationInput' ) input: ConversationInput,
        @Ctx() { req, loaders, currentUser }: Context,
        @PubSub( Subscriptions.ConversationUpdated ) publish: Publisher<Conversation>
    ): Promise<Conversation>
    {
        let conversation = await Conversation.findOneOrFail( id, {
            where: {
                author: currentUser.id
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

    @UseMiddleware( attachCurrentUser )
    @Mutation( () => DeleteConversationResult )
    public async deleteConversation(
        @Arg( 'id', () => ID ) id: number,
        @Ctx() { req, loaders, currentUser }: Context,
        @PubSub( Subscriptions.ConversationDeleted ) publish: Publisher<Conversation>
    ): Promise<DeleteConversationResult>
    {
        const conversation = await Conversation.findOneOrFail( id, {
            where: {
                author: currentUser.id
            }
        } );

        await publish( conversation );

        await conversation.remove();

        return {
            result: true,
        };
    }

    @Authorized( { action: Actions.ChangeConversationStatus } )
    @UseMiddleware( attachCurrentUser )
    @Mutation( () => Conversation )
    public async changeStatus(
        @Arg( 'conversationID', () => ID ) conversationID: number,
        @Arg( 'status', () => ConversationStatuses ) status: ConversationStatuses,
        @Ctx() { loaders: { conversations } }: Context
    ): Promise<Conversation>
    {
        const conversation = await conversations.load( conversationID.toString() );
        conversation.status = status;

        await conversation.save();

        return conversation;
    }

}
