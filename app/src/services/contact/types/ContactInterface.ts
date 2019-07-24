import ModelInterface from '../../../types/ModelInterface';
import UserInterface from '../../user/types/UserInterface';
import { Moment } from 'moment';

export default interface ContactInterface extends ModelInterface
{
    user: Promise<UserInterface> | UserInterface;
    subject: string;
    content: string;
    createdAt: Moment;
}
