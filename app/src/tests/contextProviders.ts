import { HEADER_TOKEN_KEY } from '../constants/request';
import { createLoaders } from '../graphql/getContext';
import User from '../services/user/models/User';

export const contextForUserTests = ( user: User, ip: string ) => ( {
    req:     {
        headers:    {
            'X-Client-IP':        ip,
            [ HEADER_TOKEN_KEY ]: user ? user.createToken().value : '',
        },
        header( key: string )
        {
            return this.headers[ key ];
        },
        connection: {
            remoteAddress: ip
        }
    },
    loaders: createLoaders()
} );

export const contextWithUser = ( user: User ) => ( {
    req:     {
        headers: {
            [ HEADER_TOKEN_KEY ]: user ? user.createToken().value : '',
        },
        header( key: string )
        {
            return this.headers[ key ];
        },
    },
    loaders: createLoaders()
} );
