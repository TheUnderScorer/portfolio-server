import { MiddlewareFn } from 'type-graphql';
import Context from '../../../../types/graphql/Context';
import { getUser } from '../authorization';

const attachCurrentUser: MiddlewareFn<Context> = async ( { context }, next ) =>
{
    const { loaders: { users }, req } = context;
    context.currentUser = await getUser( req, users );

    return next();
};

export default attachCurrentUser;
