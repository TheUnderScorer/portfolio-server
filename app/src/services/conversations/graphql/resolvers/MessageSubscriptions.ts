import Message from '../../models/Message';
import { Resolver, Root, Subscription } from 'type-graphql';
import { Subscriptions } from '../../../../types/graphql/Subscriptions';
import { checkAuthor } from '../subscriptions/filters';

@Resolver( Message )
export default class MessageSubscriptions
{

    @Subscription( {
        topics:      Subscriptions.NewMessage,
        filter:      checkAuthor,
        description: 'Subscription that gets triggered whenever new message is being sent.'
    } )
    public newMessage(
        @Root() message: Message
    ): Message
    {
        return message;
    }

}
