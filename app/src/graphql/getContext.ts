import Context from '../types/graphql/Context';
import * as DataLoader from 'dataloader';
import Conversation from '../services/conversations/models/Conversation';
import Message from '../services/conversations/models/Message';
import User from '../services/user/models/User';

export const loaders = {
    users:         new DataLoader( ids => User.findByIds( ids ) ),
    conversations: new DataLoader( ids => Conversation.findByIds( ids ) ),
    messages:      new DataLoader( ids => Message.findByIds( ids ) )
};

export default () => ( { req } ): Context => ( {
    req,
    loaders
} );
