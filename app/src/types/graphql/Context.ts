import * as DataLoader from 'dataloader';
import User from '../../services/user/models/User';
import Conversation from '../../services/conversations/models/Conversation';
import Message from '../../services/conversations/models/Message';
import { Request } from 'express';

export default interface Context
{
    req: Request;
    loaders: ContextLoaders
}

export type ContextLoaders = {
    users: DataLoader<string, User>;
    conversations: DataLoader<string, Conversation>;
    messages: DataLoader<string, Message>;
};
