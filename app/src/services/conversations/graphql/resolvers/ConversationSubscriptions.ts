import { Resolver, Root, Subscription } from 'type-graphql';
import Conversation from '../../models/Conversation';
import { Subscriptions } from '../../../../types/graphql/Subscriptions';
import { checkConversationAuthor } from '../subscriptions/filters';

@Resolver( Conversation )
export default class ConversationSubscriptions
{

    @Subscription( {
        topics: Subscriptions.NewConversation,
        filter: checkConversationAuthor,
    } )
    public newConversation(
        @Root() conversation: Conversation,
    ): Conversation
    {
        return conversation;
    }

    @Subscription( {
        topics: Subscriptions.ConversationUpdated,
        filter: checkConversationAuthor
    } )
    public conversationUpdated(
        @Root() conversation: Conversation
    ): Conversation
    {
        return conversation;
    }

    @Subscription( {
        topics: Subscriptions.ConversationDeleted,
        filter: checkConversationAuthor
    } )
    public conversationDeleted(
        @Root() conversation: Conversation
    ): Conversation
    {
        return conversation;
    }

}
