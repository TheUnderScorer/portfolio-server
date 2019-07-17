import { Request } from 'express';
import { canCreateUser } from '../authorization';
import User from '../../models/User';
import * as moment from 'moment';

export default async ( { user: input = {} }, request: Request ) =>
{
    await canCreateUser( request );

    const user = User.create( input );

    user.ip = request.clientIp;
    user.lastLogin = moment();

    await user.save();

    const token = user.createToken();

    return {
        user: user.toJSON(),
        token
    };
}
