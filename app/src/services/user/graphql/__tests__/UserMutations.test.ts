import setupTests, { testsConfig } from '../../../../tests/setupTests';
import afterEveryTest from '../../../../tests/afterEveryTest';
import createMany from '../../../../tests/factories/createMany';
import userFactory from '../../../../tests/factories/userFactory';
import User from '../../models/User';
import { ErrorCodes } from '../../../../types/ErrorCodes';
import { ApolloServer } from 'apollo-server';
import { HEADER_TOKEN_KEY } from '../../../../constants/request';
import { loaders } from '../../../../graphql/getContext';
import { graphql, GraphQLSchema } from 'graphql';
import UserInterface from '../../types/UserInterface';

describe( 'graphql users resolvers', () =>
{
    let server: ApolloServer;
    let user: User;
    let schema: GraphQLSchema;

    const config = { ...testsConfig };
    config.contextProvider = () => ( {
        req: {
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
        loaders
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

    it( 'createUser mutation', async () =>
    {
        const mutation = `
            mutation {
                createUser(userInput: {name: "John", email: "john@gmail.com"}) {
                    id,
                    name,
                    role,
                    lastLogin,
                    email,
                    token {
                        value
                        expires
                    }
                }
            }
        `;

        const res = await graphql( {
            schema,
            contextValue: config.contextProvider( {} ),
            source:       mutation
        } );

        const user = res.data.createUser as UserInterface;

        expect( user.name ).toEqual( 'John' );
        expect( user.email ).toEqual( 'john@gmail.com' );
    } );

    it( 'createUser mutation should return error if IP limit have been exceeded', async () =>
    {
        const users = await createMany( parseInt( process.env.ACCOUNTS_PER_IP ), userFactory, {
            ip: '::ffff:127.0.0.1'
        } );

        const mutation = `
            mutation CreateUser($user: UserInput!) {
                createUser(userInput: $user) {
                    id,
                    name,
                    role,
                    lastLogin,
                    email,
                    token {
                        value
                        expires
                    }
                }

            }
        `;

        const res = await graphql( {
            schema,
            source:         mutation,
            contextValue:   config.contextProvider( {} ),
            variableValues: {
                user: {
                    name: 'John'
                }
            },
        } );

        const errors = res.errors as any;

        expect( errors[ 0 ].originalError.name ).toEqual( ErrorCodes.AccountLimitExceeded );
    } );

    /*it( 'getUsers', async () =>
    {
        const users = await createMany( 14, userFactory );

        const query = gql`
            {
                getUsers(page: 1, perPage: 15) {
                    id,
                    ip,
                    name,
                    lastLogin
                }
            }
        `;

        const res = await client.query( {
            query
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

    it( 'updateUser mutation', async () =>
    {
        const mutation = gql`
            mutation UpdateUser($id: ID!, $user: UserInput) {
                updateUser(id: $id, user: $user) {
                    id,
                    name,
                    email,
                    password,
                    role,
                    ip
                }

            }
        `;

        const input: UserInput = {
            name:     faker.name.firstName(),
            email:    faker.internet.email(),
            password: faker.internet.password()
        };

        const res = await client.mutate( {
            mutation,
            variables: {
                id:   user.id.toString(),
                user: input
            },
        } );

        const result = res.data.updateUser as UserInterface;

        expect( result.email ).toEqual( input.email );
        expect( result.name ).toEqual( input.name );
    } );*/

} );
