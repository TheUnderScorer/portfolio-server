import ConversationInterface from './ConversationInterface';
import UserInterface from '../../user/types/UserInterface';
import { Moment } from 'moment';
import ModelInterface from '../../../types/ModelInterface';

export default interface MessageInterface extends ModelInterface
{
    author: Promise<UserInterface>;
    conversation: Promise<ConversationInterface>;
    content: string;
    createdAt: Moment;
    updatedAt: Moment;
}
