import { Request } from 'express';
import User from '../../models/User';
import { canModifyUser, getUser } from '../authorization';

export default async ( parent, { id, user: input = {} }, request: Request ) =>
{
    const currentUser = await getUser( request );
    let user = await User.findOne( id );

    await canModifyUser( currentUser, user );

    user = Object.assign( user, input );
    await user.save();

    return user;
}
