import { ResolverFilterData } from 'type-graphql';
import Conversation from '../../models/Conversation';
import SubscriptionContext from '../../../../types/graphql/SubscriptionContext';
import { UserRole } from '../../../user/types/UserRole';
import Message from '../../models/Message';

export const checkAuthor = async ( { context, payload }: ResolverFilterData<Conversation | Message, any, SubscriptionContext> ) =>
{
    return ( await payload.author ).id === context.user.id || context.user.role === UserRole.administrator;
};
