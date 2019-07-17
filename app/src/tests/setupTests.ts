import * as supertest from 'supertest';
import { SuperTest } from 'supertest';
import { bootstrap } from '../app';
import appConfig from '../config/appConfig';
import * as dotenv from 'dotenv';
import * as Path from 'path';
import events from '../events';
import { Application } from 'express';
import { Server } from 'http';

type SetupTestsResult = {
    api: SuperTest<supertest.Test>;
    app: Application;
    server: Server;
}

export default (): Promise<SetupTestsResult> =>
{
    return new Promise( async resolve =>
    {
        process.env = Object.assign( process.env, { NODE_ENV: 'tests' } );

        dotenv.config( {
            path: Path.join( __dirname, '../../.tests.env' )
        } );

        require( '../app' );
        require( '../db' );

        const { app, server } = await bootstrap( appConfig );
        const api = supertest( server );

        events.on( 'app.db.connected', () => resolve( { api, app, server } ) );
    } );

}
