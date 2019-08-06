import events from './events';
import { Connection, createConnection } from 'typeorm';
import AppConfig from './types/AppConfig';

export let connection: Connection;

events.on( 'app.server.started', ( config: AppConfig ) =>
{
    createConnection( {
        type:        'mariadb',
        host:        process.env.DB_HOST,
        port:        parseInt( process.env.DB_PORT ),
        username:    process.env.DB_USER,
        password:    process.env.DB_PASS,
        database:    process.env.DB,
        entities:    config.entities,
        synchronize: true,
        logging:     true,
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
