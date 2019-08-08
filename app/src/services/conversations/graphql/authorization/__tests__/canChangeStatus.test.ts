import { ApolloServer } from 'apollo-server';
import User from '../../../../user/models/User';
import { GraphQLSchema } from 'graphql';
import setupTests, { testsConfig } from '../../../../../tests/setupTests';
import userFactory from '../../../../../tests/factories/userFactory';
import afterEveryTest from '../../../../../tests/afterEveryTest';
import conversationFactory from '../../../../../tests/factories/conversationFactory';
import { ConversationStatuses } from '../../../types/ConversationInterface';
import canChangeStatus from '../canChangeStatus';
import { ErrorCodes } from '../../../../../types/ErrorCodes';
import { contextWithUser } from '../../../../../tests/contextProviders';

describe( 'canChangeStatus', () =>
{

    let server: ApolloServer;
    let user: User;
    let schema: GraphQLSchema;

    const config = { ...testsConfig };

    beforeAll( async () =>
    {
        const setup = await setupTests( config );

        server = setup.server;
        schema = setup.schema;
    } );

    beforeEach( async () =>
    {
        user = await userFactory();
    } );

    afterEach( async () =>
    {
        await afterEveryTest( config );
    } );

    afterAll( async () =>
    {
        await server.stop();
    } );

    it( 'Should throw error if user tries to open closed conversation', async ( done ) =>
    {
        const conversation = await conversationFactory( {
            author: user,
            status: ConversationStatuses.closed
        } );

        try {
            await canChangeStatus( {
                args:    {
                    input: {
                        id:     conversation.id,
                        status: ConversationStatuses.open
                    }
                },
                // @ts-ignore
                info:    {},
                // @ts-ignore
                context: contextWithUser( user ),

            } );
        } catch ( e ) {
            expect( e.name ).toEqual( ErrorCodes.CannotOpenConversation );

            return done();
        }

        fail( 'No exception thrown.' );
    } );

} );
