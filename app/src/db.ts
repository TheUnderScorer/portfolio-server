import events from './events';
import { Connection, createConnection } from 'typeorm';
import User from './services/user/models/User';
import { ApolloServer } from 'apollo-server';

export const entities = [ User ];

export let connection: Connection;

events.on( 'app.server.started', ( server: ApolloServer ) =>
{
    createConnection( {
        type:            'mongodb',
        host:            process.env.DB_HOST,
        port:            parseInt( process.env.DB_PORT ),
        username:        process.env.DB_USER,
        password:        process.env.DB_PASS,
        database:        process.env.DB,
        useNewUrlParser: true,
        entities:        entities,
        synchronize:     true,
        logging:         true,
    } ).then( ( conn ) =>
    {
        console.log( 'Connected do database!' );

        connection = conn;

        events.emit( 'app.db.connected', conn )
    } ).catch( err =>
    {
        console.error( 'Error while connecting to database:', err );

        process.exit( 1 );
    } )
} );
