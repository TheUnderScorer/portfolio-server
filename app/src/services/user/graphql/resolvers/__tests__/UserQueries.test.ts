import { ApolloServer } from 'apollo-server';
import User from '../../../models/User';
import { graphql, GraphQLSchema } from 'graphql';
import setupTests, { testsConfig } from '../../../../../tests/setupTests';
import { HEADER_TOKEN_KEY } from '../../../../../constants/request';
import { createLoaders } from '../../../../../graphql/getContext';
import userFactory from '../../../../../tests/factories/userFactory';
import afterEveryTest from '../../../../../tests/afterEveryTest';
import createMany from '../../../../../tests/factories/createMany';

describe( 'UserQueries resolver', () =>
{

    let server: ApolloServer;
    let user: User;
    let schema: GraphQLSchema;

    const config = { ...testsConfig };
    config.contextProvider = () => ( {
        req:     {
            headers:    {
                'X-Client-IP':        '::ffff:127.0.0.1',
                [ HEADER_TOKEN_KEY ]: user ? user.createToken().value : '',
            },
            header( key: string )
            {
                return this.headers[ key ];
            },
            connection: {
                remoteAddress: '::ffff:127.0.0.1'
            }
        },
        loaders: createLoaders()
    } );

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
        const users = await createMany( 14, userFactory );

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
            contextValue: config.contextProvider( {} )
        } );

        const mapID = ( { id }: User ) =>
        {
            return id.toString();
        };

        const fetchedUsers = res.data.getUsers as User[];
        const fetchedUsersIDs = fetchedUsers.map( mapID );

        users.push( user );

        const usersToCheck = users.map( mapID );

        expect( users ).toHaveLength( 15 );

        usersToCheck.forEach( userID =>
        {
            expect( fetchedUsersIDs ).toContain( userID );
        } );
    } );

    it( 'getUser query', async () =>
    {

    } )

} );
