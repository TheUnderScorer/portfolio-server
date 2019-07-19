import setupTests, { testsConfig } from '../../../../../tests/setupTests';
import afterEveryTest from '../../../../../tests/afterEveryTest';
import userFactory from '../../../../../tests/factories/userFactory';
import User from '../../../models/User';
import { ErrorCodes } from '../../../../../types/ErrorCodes';
import { ApolloServer } from 'apollo-server';
import { HEADER_TOKEN_KEY } from '../../../../../constants/request';
import { loaders } from '../../../../../graphql/getContext';
import { graphql, GraphQLSchema } from 'graphql';
import UserInterface from '../../../types/UserInterface';
import * as faker from 'faker';
import UserInput from '../../inputs/UserInput';
import { UserRole } from '../../../types/UserRole';
import createMany from '../../../../../tests/factories/createMany';

describe( 'graphql users resolvers', () =>
{
    let server: ApolloServer;
    let user: User;
    let schema: GraphQLSchema;

    const ip = '::ffff:127.0.0.1';

    const config = { ...testsConfig };
    config.contextProvider = () => ( {
        req: {
            headers:    {
                'X-Client-IP':        ip,
                [ HEADER_TOKEN_KEY ]: user ? user.createToken().value : '',
            },
            header( key: string )
            {
                return this.headers[ key ];
            },
            connection: {
                remoteAddress: ip
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
        await createMany(
            parseInt( process.env.ACCOUNTS_PER_IP ),
            userFactory,
            {
                ip
            }
        );

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
                    name: 'John',
                }
            },
        } );

        const errors = res.errors as any;

        expect( errors[ 0 ].originalError.name ).toEqual( ErrorCodes.AccountLimitExceeded );
    } );

    it( 'updateMe mutation', async () =>
    {
        const mutation = `
            mutation UpdateMe($user: UserInput!) {
                updateMe(userInput: $user) {
                    id,
                    name,
                    email,
                    role,
                }

            }
        `;

        const input: UserInput = {
            name:     faker.name.firstName(),
            email:    faker.internet.email(),
            password: faker.internet.password()
        };

        const res = await graphql( {
            schema,
            source:         mutation,
            variableValues: {
                user: input
            },
            contextValue:   config.contextProvider( {} )
        } );

        const result = res.data.updateMe as UserInterface;

        expect( result.email ).toEqual( input.email );
        expect( result.name ).toEqual( input.name );
    } );

    it( 'updateUser mutation', async () =>
    {
        user.role = UserRole.administrator;
        await user.save();

        const targetUser = await userFactory();

        const mutation = `
            mutation UpdateUser($id: ID!, $user: UserInput!) {
                updateUser(id: $id, userInput: $user) {
                    id,
                    name,
                    email,
                    role,
                }
            }
        `;

        const input: UserInput = {
            name:     faker.name.firstName(),
            email:    faker.internet.email(),
            password: faker.internet.password()
        };

        const res = await graphql( {
            schema,
            source:         mutation,
            variableValues: {
                id:   targetUser.id,
                user: input
            },
            contextValue:   config.contextProvider( {} )
        } );

        const result = res.data.updateUser as UserInterface;

        expect( result.email ).toEqual( input.email );
        expect( result.name ).toEqual( input.name );
    } );

} );
