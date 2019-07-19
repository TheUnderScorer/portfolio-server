import { UserRole } from '../../services/user/types/UserRole';
import { Actions } from './Actions';

export default interface AuthHandlerArgs
{
    role?: UserRole;
    action?: keyof Actions;
}
