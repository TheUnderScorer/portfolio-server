import User from '../../services/user/models/User';
import { ContextLoaders } from './Context';

export default interface SubscriptionContext
{
    user: User;
    loaders: ContextLoaders;
}
