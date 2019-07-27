import { Request } from 'express';
import { HEADER_TOKEN_KEY } from '../../../constants/request';
import { getUserByToken } from '../../../common/jwt';
import User from '../models/User';
import Exception from '../../../errors/Exception';
import { ErrorCodes } from '../../../types/ErrorCodes';
import * as requestIP from 'request-ip';
import RequestError from '../../../errors/RequestError';
import { BAD_REQUEST } from 'http-status';
import * as DataLoader from 'dataloader';
import { AuthAction } from '../../../types/graphql/AuthActions';

export const getUser = async ( request: Request, loader: DataLoader<string, User> ): Promise<User> =>
{
    const token = request.header( HEADER_TOKEN_KEY );

    return getUserByToken( token, loader );
};

export const canCreateUser: AuthAction = async ( { req } ) =>
{
    const clientIp = requestIP.getClientIp( req );

    const accountsPerIP = parseInt( process.env.ACCOUNTS_PER_IP );

    const usersByIP = await User.count( {
        where: {
            ip: clientIp
        }
    } );

    if ( usersByIP >= accountsPerIP ) {
        throw new RequestError(
            'Account limit for this ip have been exceeded.',
            ErrorCodes.AccountLimitExceeded,
            BAD_REQUEST
        )
    }

    return true;
};

export const canModifyUser = async ( currentUser: User, modifiedUser: User ): Promise<void> =>
{
    if ( currentUser.id === modifiedUser.id ) {
        return;
    }

    if ( currentUser.role !== 'administrator' ) {
        throw new Exception( 'You cannot edit this user.', ErrorCodes.CannotEditUser )
    }
};
