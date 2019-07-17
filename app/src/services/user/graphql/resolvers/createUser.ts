import { canCreateUser } from '../authorization';
import User from '../../models/User';
import { Request } from 'express';
import * as requestIp from 'request-ip';

export default async ( parent, { user: input }, request: Request ) =>
{
    await canCreateUser( request );

    const user = User.create( input );
    user.ip = requestIp.getClientIp( request );

    await user.updateLastLogin();
    await user.save();

    const token = user.createToken();

    return {
        user: user.toJSON(),
        token
    };
}
