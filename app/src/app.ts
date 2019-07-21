import { ApolloServer, ServerInfo } from 'apollo-server';
import errorFormatter from './graphql/errorFormatter';
import events from './events';
import AppConfig from './types/AppConfig';
import { buildSchema } from 'type-graphql';
import authHandler from './graphql/auth';
import { GraphQLSchema } from 'graphql';

export type BootstrapResult = {
    server: ApolloServer;
    serverInfo: ServerInfo;
    schema: GraphQLSchema
}

export const bootstrap = ( config: AppConfig ): Promise<BootstrapResult> =>
{
    return new Promise( async ( resolve ) =>
    {
        const port = process.env.PORT;

        events.emit( 'app.server.beforeStart', config );

        const schema = await buildSchema( {
            ...config.schemaOptions,
            authChecker: authHandler( config.authActions ),
        } );

        const server = new ApolloServer( {
            schema,
            formatError: errorFormatter,
            context:     config.contextProvider,
        } );

        server.listen( { port } ).then( ( serverInfo ) =>
        {
            console.log( `Server ready at ${ serverInfo.url }` );
            console.log( `Subscriptions ready at ws://localhost:${ port }${ server.subscriptionsPath }` );

            events.emit( 'app.server.started', config, server, serverInfo );

            resolve( { server, serverInfo, schema } );
        } );
    } );
};
