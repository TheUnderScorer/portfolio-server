import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';
import errorFormatter from './graphql/errorFormatter';
import events from './events';
import AppConfig from './types/AppConfig';

export type BootstrapResult = {
    server: ApolloServer;
    url: string;
}

export const bootstrap = ( config: AppConfig ): Promise<BootstrapResult> =>
{
    return new Promise( async ( resolve ) =>
    {
        const port = process.env.PORT;
        const url = process.env.SERVER_URL;

        events.emit( 'app.server.beforeGateway', config );

        const gateway = new ApolloGateway( {
            serviceList: [
                {
                    name: 'users',
                    url:  `${ url }:${ process.env.USERS_PORT }/graphql`
                }
            ]
        } );

        const { schema, executor } = await gateway.load();

        const server = new ApolloServer( {
            schema,
            executor,
            formatError: errorFormatter
        } );

        server.listen( { port } ).then( ( { url } ) =>
        {
            console.log( `Server ready at ${ url }` );

            events.emit( 'app.server.started', server );

            resolve( { server, url } );
        } );
    } );
};
