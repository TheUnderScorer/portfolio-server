import User from '../models/User';

export const canViewOtherUsers = ( user: User ): boolean =>
{
    return user.role === 'administrator';
};
