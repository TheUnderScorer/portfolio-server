import Conversation from '../../models/Conversation';
import { Arg, Authorized, Ctx, ID, Mutation, Publisher, PubSub, Resolver, UseMiddleware } from 'type-graphql';
import ConversationInput from '../inputs/ConversationInput';
import Context from '../../../../types/graphql/Context';
import Result from '../../../../graphql/objects/Result';
import { Subscriptions } from '../../../../types/graphql/Subscriptions';
import { Actions } from '../../../../types/graphql/Actions';
import attachCurrentUser from '../../../user/graphql/middlewares/attachCurrentUser';
import sendTranscript from '../../common/sendTranscript';
import ChangeConversationStatusInput from '../inputs/ChangeConversationStatusInput';
import events from '../../../../events';
import RequestError from '../../../../errors/RequestError';
import { ErrorCodes } from '../../../../types/ErrorCodes';

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
    @Mutation( () => Result )
    public async deleteConversation(
        @Arg( 'id', () => ID ) id: number,
        @Ctx() { req, loaders, currentUser }: Context,
        @PubSub( Subscriptions.ConversationDeleted ) publish: Publisher<Conversation>
    ): Promise<Result>
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
        @Arg( 'input' ) { id, status, email, sendTranscript: shouldSendTranscript }: ChangeConversationStatusInput,
        @Ctx() { loaders: { conversations }, currentUser, req }: Context
    ): Promise<Conversation>
    {
        const conversation = await conversations.load( id );
        conversation.status = status;

        await conversation.save();

        if ( shouldSendTranscript ) {

            if ( !email && !currentUser ) {
                throw new RequestError(
                    'You must provide e-mail address to which transcript will be sent.',
                    ErrorCodes.MissingEmailForTranscript
                );
            }

            sendTranscript(
                conversation,
                !currentUser.email ? email : currentUser.email,
            )
                .then( () => events.emit( 'app.conversation.transcriptSent', conversation, currentUser, req ) )
        }

        return conversation;
    }

    @UseMiddleware( attachCurrentUser )
    @Mutation( () => Result, {
        description: 'Sends transcript of given conversation to it\'s author.'
    } )
    public async sendTranscript(
        @Arg( 'conversationID', () => ID ) conversationID: number,
        @Ctx() { currentUser, loaders: { conversations } }: Context
    ): Promise<Result>
    {
        const conversation = await conversations.save( () =>
        {
            return Conversation.findOneOrFail( {
                where: {
                    author: currentUser.id,
                    id:     conversationID
                }
            } );
        } );

        await sendTranscript( conversation, currentUser.email );

        return {
            result: true
        }
    }

}
