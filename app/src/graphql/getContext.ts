import Context, { ContextLoaders } from '../types/graphql/Context';
import * as DataLoader from 'dataloader';
import Conversation from '../services/conversations/models/Conversation';
import Message from '../services/conversations/models/Message';
import User from '../services/user/models/User';
import { HEADER_TOKEN_KEY } from '../constants/request';
import SubscriptionContext from '../types/graphql/SubscriptionContext';
import { getUserByToken } from '../common/jwt';

export const createLoaders = (): ContextLoaders => ( {
    users:         new DataLoader( ids => User.findByIds( ids ) ),
    conversations: new DataLoader( ids => Conversation.findByIds( ids ) ),
    messages:      new DataLoader( ids => Message.findByIds( ids ) )
} );

export default () => async ( { req, connection }, ): Promise<Context | SubscriptionContext> =>
{
    const loaders = createLoaders();

    if ( !connection ) {
        return {
            req,
            loaders
        }
    }

    const { context } = connection;
    const token = context[ HEADER_TOKEN_KEY ];

    const user = await getUserByToken( token, loaders.users );

    return {
        user,
        loaders
    };
}
