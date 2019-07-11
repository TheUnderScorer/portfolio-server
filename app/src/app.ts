import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import events from './events';
import { Server } from 'http';
import * as cors from 'cors';
import AppConfig from './types/AppConfig';

const app = express();
export const server = new Server( app );

export const bootstrap = ( appConfig: AppConfig ) =>
{

    return new Promise( resolve =>
    {

        app.use( helmet() );
        app.use( morgan( process.env.NODE_ENV === 'development' ? 'dev' : 'prod' ) );
        app.use( cors( appConfig.cors ) );

        server.listen( process.env.PORT, () =>
        {
            console.log( 'Server started on port', process.env.PORT );

            events.emit( 'app.serverStarted', app, server );

            resolve( { app, server } );
        } );

    } );

};


export default app;
