import { UserRole } from './UserRole';
import { Moment } from 'moment';

export default interface UserInterface
{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    lastLogin: Moment | string;
    ip: string;
}
