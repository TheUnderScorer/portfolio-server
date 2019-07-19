import ConversationInterface from './ConversationInterface';
import UserInterface from '../../user/types/UserInterface';
import { Moment } from 'moment';

export default interface MessageInterface
{
    author: Promise<UserInterface>;
    conversation: Promise<ConversationInterface>;
    content: string;
    createdAt: Moment;
    updatedAt: Moment;
}
