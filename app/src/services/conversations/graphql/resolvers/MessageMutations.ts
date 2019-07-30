import { Arg, Authorized, Ctx, Mutation, Publisher, PubSub, Resolver, UseMiddleware } from 'type-graphql';
import Message from '../../models/Message';
import MessageInput from '../inputs/MessageInput';
import Context from '../../../../types/graphql/Context';
import attachCurrentUser from '../../../user/graphql/middlewares/attachCurrentUser';
import Conversation from '../../models/Conversation';
import { Actions } from '../../../../types/graphql/Actions';
import { Subscriptions } from '../../../../types/graphql/Subscriptions';
import { FindOneOptions } from 'typeorm';
import { UserRole } from '../../../user/types/UserRole';

@Resolver( Message )
export default class MessageMutations
{

    @Authorized( { action: Actions.SendMessage } )
    @UseMiddleware( attachCurrentUser )
    @Mutation( () => Message )
    public async sendMessage(
        @Arg( 'messageInput' ) { content, conversationID }: MessageInput,
        @Ctx() { currentUser, loaders: { conversations, messages } }: Context,
        @PubSub( Subscriptions.NewMessage ) publish: Publisher<Message>
    ): Promise<Message>
    {
        const findOptions: FindOneOptions<Conversation> = {
            where: {
                id: conversationID,
            }
        };

        if ( currentUser.role !== UserRole.administrator ) {
            // @ts-ignore
            findOptions.where.author = currentUser.id;
        }

        const conversation = await Conversation.findOneOrFail( findOptions );
        conversations.prime( conversation.id.toString(), conversation );

        const message = Message.create( {
            content
        } );
        message.author = Promise.resolve( currentUser );
        message.conversation = Promise.resolve( conversation );

        await message.save();
        messages.prime( message.id.toString(), message );

        await publish( message );

        return message;
    }

}
