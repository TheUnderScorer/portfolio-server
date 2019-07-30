import { Resolver, Root, Subscription } from 'type-graphql';
import Conversation from '../../models/Conversation';
import { Subscriptions } from '../../../../types/graphql/Subscriptions';
import { checkAuthor } from '../subscriptions/filters';

@Resolver( Conversation )
export default class ConversationSubscriptions
{

    @Subscription( {
        topics: Subscriptions.NewConversation,
        filter: checkAuthor,
    } )
    public newConversation(
        @Root() conversation: Conversation,
    ): Conversation
    {
        return conversation;
    }

    @Subscription( {
        topics: Subscriptions.ConversationUpdated,
        filter: checkAuthor
    } )
    public conversationUpdated(
        @Root() conversation: Conversation
    ): Conversation
    {
        return conversation;
    }

    @Subscription( {
        topics: Subscriptions.ConversationDeleted,
        filter: checkAuthor
    } )
    public conversationDeleted(
        @Root() conversation: Conversation
    ): Conversation
    {
        return conversation;
    }

}
