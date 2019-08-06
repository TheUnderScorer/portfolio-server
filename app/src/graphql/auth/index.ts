import { AuthChecker } from 'type-graphql';
import Context from '../../types/graphql/Context';
import AuthHandlerArgs from '../../types/graphql/AuthHandlerArgs';
import { AuthActions } from '../../types/graphql/AuthActions';
import { getUser } from '../../services/user/graphql/authorization';

const authHandler = ( actions: AuthActions ): AuthChecker<Context, AuthHandlerArgs> => async (
    data,
    [ { action, role } ]
) =>
{
    const { context } = data;
    const { req, loaders } = context;

    let result: boolean = true;

    if ( action && actions[ action ] ) {
        // @ts-ignore
        result = await actions[ action ]( data );
    }

    if ( !result ) {
        return result;
    }

    if ( role ) {
        const currentUser = await getUser( req, loaders.users );

        if ( currentUser.role !== role ) {
            return false;
        }
    }

    return result;
};

export default authHandler;
