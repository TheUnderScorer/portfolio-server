import { Request } from 'express';
import { HEADER_TOKEN_KEY } from '../../../constants/request';
import { getUserByToken } from '../../../common/jwt';
import User from '../models/User';
import Exception from '../../../errors/Exception';
import { ErrorCodes } from '../../../types/ErrorCodes';
import * as requestIP from 'request-ip';
import RequestError from '../../../errors/RequestError';
import { BAD_REQUEST } from 'http-status';

export const getUser = async ( request: Request ): Promise<User> =>
{
    const token = request.header( HEADER_TOKEN_KEY );

    return getUserByToken( token );
};

export const canCreateUser = async ( request: Request ): Promise<void> =>
{
    const clientIp = requestIP.getClientIp( request );

    const accountsPerIP = parseInt( process.env.ACCOUNTS_PER_IP );

    // TODO User.count does not work here for some reason
    const usersByIP = await User.find( {
        where: {
            ip: clientIp
        }
    } );

    if ( usersByIP.length >= accountsPerIP ) {
        throw new RequestError(
            'Account limit for this ip have been exceeded.',
            ErrorCodes.AccountLimitExceeded,
            BAD_REQUEST
        )
    }
};

export const canModifyUser = async ( currentUser: User, modifiedUser: User ): Promise<void> =>
{
    if ( currentUser.id.equals( modifiedUser.id ) ) {
        return;
    }

    if ( currentUser.role !== 'administrator' ) {
        throw new Exception( 'You cannot edit this user.', ErrorCodes.CannotEditUser )
    }
};
