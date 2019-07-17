import * as jwt from 'jsonwebtoken';
import Token, { UserTokenPayload } from '../services/user/types/Token';
import * as moment from 'moment';
import User from '../services/user/models/User';
import Exception from '../errors/Exception';
import { ErrorCodes } from '../types/ErrorCodes';

export const sign = ( payload: any ): Token =>
{
    const expiresIn = process.env.TOKEN_EXPIRE;

    const value = jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        {
            expiresIn
        }
    );

    const [ howMany, unit ] = expiresIn.split( ' ' );

    return {
        value,
        expires: moment().add( parseInt( howMany ) as any, unit ).format( 'YYYY-MM-DD HH:mm:ss' )
    }
};

export const getUserByToken = async ( token: Token | string ): Promise<User> =>
{
    if ( typeof token === 'object' ) {
        token = token.value;
    }

    const value = jwt.decode( token ) as UserTokenPayload;

    if ( !value ) {
        throw new Exception( 'Unable to decode token.', ErrorCodes.InvalidToken )
    }

    const { id } = value;

    const user = await User.findOne( id );

    if ( !user ) {
        throw new Exception( 'No user found with provided token.', ErrorCodes.InvalidToken )
    }

    return user;
};
