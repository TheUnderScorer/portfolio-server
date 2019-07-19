import { UserRole } from './UserRole';
import { Moment } from 'moment';
import ConversationInterface from '../../conversations/types/ConversationInterface';
import MessageInterface from '../../conversations/types/MessageInterface';

export default interface UserInterface
{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    lastLogin: Moment | string;
    ip: string;
    conversations: Promise<ConversationInterface[]>;
    messages: Promise<MessageInterface[]>;
}
