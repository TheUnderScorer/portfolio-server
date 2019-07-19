import * as supertest from 'supertest';
import { SuperTest } from 'supertest';
import { bootstrap } from '../app';
import * as dotenv from 'dotenv';
import * as Path from 'path';
import events from '../events';
import { ApolloServer } from 'apollo-server';
import '../db';
import AppConfig from '../types/AppConfig';
import appConfig from '../config/appConfig';
import { GraphQLSchema } from 'graphql';

type SetupTestsResult = {
    api: SuperTest<supertest.Test>;
    server: ApolloServer;
    schema: GraphQLSchema;
}

export const testsConfig: AppConfig = {
    ...appConfig,
};

export default ( config: AppConfig = testsConfig ): Promise<SetupTestsResult> =>
{
    return new Promise( async resolve =>
    {
        process.env = Object.assign( process.env, { NODE_ENV: 'tests' } );

        dotenv.config( {
            path: Path.join( __dirname, '../../.tests.env' )
        } );

        const { server, serverInfo, schema } = await bootstrap( config );
        const api = supertest( serverInfo.url );

        events.on( 'app.db.connected', () => resolve( { api, server, schema } ) );
    } );

}
