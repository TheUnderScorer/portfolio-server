import setupTests, { testsConfig } from '../../../../tests/setupTests';
import * as supertest from 'supertest';
import { SuperTest } from 'supertest';
import afterEveryTest from '../../../../tests/afterEveryTest';
import '../../index';
import createMany from '../../../../tests/factories/createMany';
import userFactory from '../../../../tests/factories/userFactory';
import User from '../../models/User';
import { ErrorCodes } from '../../../../types/ErrorCodes';
import UserInput from '../../types/UserInput';
import * as faker from 'faker';
import UserInterface from '../../types/UserInterface';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server-core';
import { HEADER_TOKEN_KEY } from '../../../../constants/request';

describe( 'graphql users resolvers', () =>
{
    let api: SuperTest<supertest.Test>;
    let client: ApolloServerTestClient;
    let server: ApolloServer;
    let user: User;

    const config = { ...testsConfig };
    config.contextProvider = () => ( {
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
    } );

    beforeAll( async () =>
    {
        const setup = await setupTests( config );

        api = setup.api;
        server = setup.server;

        client = createTestClient( server );
    } );

    beforeEach( async () =>
    {
        user = await userFactory();
    } );

    afterEach( async () =>
    {
        await afterEveryTest();
    } );

    afterAll( async () =>
    {
        await server.stop();
    } );

    it( 'createUser mutation', async () =>
    {
        const mutation = gql`
            mutation CreateUser($user: UserInput) {
                createUser(user: $user) {
                    user {
                        id,
                        name,
                        role,
                        ip,
                        lastLogin,
                        email,
                        password
                    },
                    token {
                        value
                        expires
                    }
                }
            }
        `;

        const res = await client.mutate( {
            mutation,
            variables: {
                user: {
                    name:     'John',
                    email:    faker.internet.email(),
                    password: faker.internet.password()
                }
            }
        } );

        const { token = '', user = '' } = res.data.createUser;

        expect( user.name ).toEqual( 'John' );
        expect( user.role ).toEqual( 'user' );
        expect( token.value.length ).toBeGreaterThan( 0 );
    } );

    it( 'createUser mutation should return error if IP limit have been exceeded', async () =>
    {
        await createMany( parseInt( process.env.ACCOUNTS_PER_IP ), userFactory, {
            ip: '::ffff:127.0.0.1'
        } );

        const mutation = gql`
            mutation CreateUser($user: UserInput) {
                createUser(user: $user) {
                    user {
                        id,
                        name,
                        role,
                        ip
                    },
                    token {
                        value
                        expires
                    }
                }

            }
        `;

        const res = await client.mutate( {
            mutation,
            variables: {
                user: {
                    name: 'John'
                }
            }
        } );

        const errors = res.errors as any;

        expect( errors[ 0 ].name ).toEqual( ErrorCodes.AccountLimitExceeded );
    } );

    it( 'getUsers', async () =>
    {
        // Make sure that default user won't mess up our tests
        await user.remove();

        const users = await createMany( 15, userFactory );

        const query = gql`
            query GetUsers($page: Int, $perPage: Int) {
                getUsers(page: $page, perPage: $perPage) {
                    id,
                    name,
                    role
                }
            }
        `;

        const res = await client.query( {
            query,
            variables: {
                page:    1,
                perPage: 15
            }
        } );

        const mapID = ( { id }: User ) =>
        {
            return id.toString();
        };

        const fetchedUsers = res.data.getUsers as User[];
        const fetchedUsersIDs = fetchedUsers.map( mapID );

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
    } );

} );
