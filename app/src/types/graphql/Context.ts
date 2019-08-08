import User from '../../services/user/models/User';
import Conversation from '../../services/conversations/models/Conversation';
import Message from '../../services/conversations/models/Message';
import { Request } from 'express';
import DataLoader from '../../common/DataLoader';

export default interface Context
{
    req: Request;
    loaders: ContextLoaders
    currentUser?: User;
}

export type ContextLoaders = {
    users: DataLoader<string | number, User>;
    conversations: DataLoader<string | number, Conversation>;
    messages: DataLoader<string | number, Message>;
};
