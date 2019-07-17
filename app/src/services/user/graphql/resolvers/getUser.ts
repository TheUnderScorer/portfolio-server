import { Request } from 'express';
import { getUser } from '../authorization';
import { canViewOtherUsers } from '../permissions';
import User from '../../models/User';

export default async ( parent, { id }, request: Request ) =>
{
    const user = await getUser( request );

    if ( !canViewOtherUsers( user ) ) {
        return user;
    }

    return await User.findOne( id );
}
