import events from '../../events';
import { ApolloServer } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import AppConfig from '../../types/AppConfig';

const loadService = async ( config: AppConfig ) =>
{
    const server = new ApolloServer( {
        context: config.contextProvider,
        schema:  buildFederatedSchema( [
                {
                    typeDefs: schema,
                    resolvers
                }
            ],
        )
    } );

    server.listen( { port: process.env.USERS_PORT } ).then( ( { url } ) =>
    {
        console.log( `Users service ready at ${ url }` );
    } );
};

events.on( 'app.server.beforeGateway', loadService );
