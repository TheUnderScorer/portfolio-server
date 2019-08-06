import { UserRole } from './UserRole';
import { Moment } from 'moment';
import ConversationInterface from '../../conversations/types/ConversationInterface';
import MessageInterface from '../../conversations/types/MessageInterface';
import ModelInterface from '../../../types/ModelInterface';
import ContactInterface from '../../contact/types/ContactInterface';

export default interface UserInterface extends ModelInterface
{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    lastLogin: Moment | string;
    ip: string;
    conversations: Promise<ConversationInterface[]>;
    messages: Promise<MessageInterface[]>;
    contacts: Promise<ContactInterface[]>;
}
