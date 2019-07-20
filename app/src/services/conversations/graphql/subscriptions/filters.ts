import { ResolverFilterData } from 'type-graphql';
import Conversation from '../../models/Conversation';
import SubscriptionContext from '../../../../types/graphql/SubscriptionContext';

export const checkConversationAuthor = async ( { context, payload }: ResolverFilterData<Conversation, any, SubscriptionContext> ) =>
{
    return ( await payload.author ).id === context.user.id;
};
