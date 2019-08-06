import { Moment } from 'moment';
import MessageInterface from './MessageInterface';
import UserInterface from '../../user/types/UserInterface';
import ModelInterface from '../../../types/ModelInterface';

export enum ConversationStatuses
{
    'open'   = 'Open',
    'closed' = 'Closed'
}

export default interface ConversationInterface extends ModelInterface
{
    title?: string;
    createdAt: Moment;
    messages: Promise<MessageInterface[]> | MessageInterface[];
    author: Promise<UserInterface> | UserInterface;
    status: ConversationStatuses;
}
