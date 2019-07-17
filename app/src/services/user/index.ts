import events from '../../events';
import { Application, Router } from 'express';
import schema from './graphql/schema';
import * as ExpressGraphQL from 'express-graphql';
import errorFormatter from '../../graphql/errorFormatter';
import resolvers from './graphql/resolvers';

const loadService = async ( app: Application ) =>
{
    const router = Router();

    router.use( '/graphql', [], ExpressGraphQL( {
        schema:              schema,
        rootValue:           resolvers,
        graphiql:            true,
        customFormatErrorFn: errorFormatter
    } ) );

    app.use( '/users', router );
};

events.on( 'app.db.connected', loadService );
