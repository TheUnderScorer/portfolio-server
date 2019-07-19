import { Moment } from 'moment';
import MessageInterface from './MessageInterface';
import UserInterface from '../../user/types/UserInterface';

export default interface ConversationInterface
{
    title?: string;
    createdAt: Moment;
    messages: Promise<MessageInterface[]>;
    author: Promise<UserInterface>;
}
