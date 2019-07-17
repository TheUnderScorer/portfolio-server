import events from '../events';
import { Application } from 'express';
import errorFormatter from './errorFormatter';
import * as ExpressGraphQL from 'express-graphql';
import { buildSchema } from 'graphql';

const setupGraphql = ( app: Application ) =>
{
    const event = {
        schema:    '',
        resolvers: {}
    };

    // Emit event with schema object, in order to give services ability to modify it
    events.emit( 'app.graphql.setup', event );

    app.use( '/graphql', [], ExpressGraphQL( {
        schema:              buildSchema( event.schema ),
        rootValue:           event.resolvers,
        graphiql:            true,
        customFormatErrorFn: errorFormatter
    } ) );

    console.log( 'Graphql launched' );
};

events.on( 'app.db.loaded', setupGraphql );
