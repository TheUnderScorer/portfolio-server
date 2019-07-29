import { ApolloServer } from 'apollo-server';
import User from '../../../models/User';
import { graphql, GraphQLSchema } from 'graphql';
import setupTests, { testsConfig } from '../../../../../tests/setupTests';
import userFactory from '../../../../../tests/factories/userFactory';
import afterEveryTest from '../../../../../tests/afterEveryTest';
import createMany from '../../../../../tests/factories/createMany';
import { contextWithUser } from '../../../../../tests/contextProviders';

describe( 'UserQueries resolver', () =>
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

    it( 'getUsers query', async () =>
    {
        await createMany( 14, userFactory );

        const query = `
            {
                getUsers(page: 1, perPage: 15) {
                    id,
                    name,
                    lastLogin
                }
            }
        `;

        const res = await graphql( {
            schema,
            source:       query,
            contextValue: contextWithUser( user )
        } );

        const fetchedUsers = res.data.getUsers as User[];

        expect( fetchedUsers ).toHaveLength( 15 );
    } );

} );
