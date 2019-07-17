import events from './events';
import { Application } from 'express';
import { createConnection } from 'typeorm';
import User from './services/user/models/User';

export const entities = [ User ];

events.on( 'app.serverStarted', ( app: Application ) =>
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
    } ).then( ( connection ) =>
    {
        console.log( 'Connected do database!' );

        app.set( 'connection', connection );

        events.emit( 'app.db.connected', app, connection )
    } ).catch( err =>
    {
        console.error( 'Error while connecting to database:', err );

        process.exit( 1 );
    } )
} );
