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

export const bootstrap = async ( config: AppConfig ): Promise<BootstrapResult> =>
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

    const serverInfo = await server.listen( { port } );

    console.log( `Server ready at ${ serverInfo.url }` );
    console.log( `Subscriptions ready at ws://localhost:${ port }${ server.subscriptionsPath }` );

    events.emit( 'app.server.started', config, server, serverInfo );

    return { server, serverInfo, schema }
};
