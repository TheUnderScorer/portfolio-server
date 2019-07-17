import setupTests from '../../../../tests/setupTests';
import * as supertest from 'supertest';
import { SuperTest } from 'supertest';
import afterEveryTest from '../../../../tests/afterEveryTest';
import { Application } from 'express';
import '../../index';
import createMany from '../../../../tests/factories/createMany';
import userFactory from '../../../../tests/factories/userFactory';
import User from '../../models/User';
import { ErrorCodes } from '../../../../types/ErrorCodes';
import UserInput from '../../types/UserInput';
import * as faker from 'faker';
import { HEADER_TOKEN_KEY } from '../../../../constants/request';
import UserInterface from '../../types/UserInterface';

describe( 'graphql users resolvers', () =>
{
    let api: SuperTest<supertest.Test>;
    let app: Application;

    beforeAll( async () =>
    {
        const setup = await setupTests();

        api = setup.api;
        app = setup.app;
    } );

    afterEach( async () =>
    {
        await afterEveryTest( app );
    } );

    it( 'createUser mutation', async () =>
    {
        const query = `
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

        return api
            .post( '/users/graphql' )
            .send( {
                query,
                variables: {
                    user: {
                        name:     'John',
                        email:    faker.internet.email(),
                        password: faker.internet.password()
                    }
                }
            } )
            .then( response =>
            {
                const { token = '', user = '' } = response.body.data.createUser;

                expect( user.name ).toEqual( 'John' );
                expect( user.role ).toEqual( 'user' );
                expect( token.value.length ).toBeGreaterThan( 0 );
            } )
    } );

    it( 'createUser mutation should return error if IP limit have been exceeded', async () =>
    {
        await createMany( parseInt( process.env.ACCOUNTS_PER_IP ), userFactory, {
            ip: '::ffff:127.0.0.1'
        } );

        const query = `
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

        return api
            .post( '/users/graphql' )
            .send( {
                query,
                user: {
                    name: 'John'
                }
            } )
            .then( response =>
            {
                const { errors } = response.body;

                expect( errors[ 0 ].code ).toEqual( ErrorCodes.AccountLimitExceeded );
            } )
    } );

    it( 'getUsers', async () =>
    {
        const users = await createMany( 15, userFactory );

        const query = `
            {
                getUsers(page: 1, perPage: 15) {
                    id,
                    name,
                    role
                }
            }
        `;

        return api
            .post( '/users/graphql' )
            .send( { query } )
            .then( response =>
            {
                const mapID = ( { id }: User ) =>
                {
                    return id.toString();
                };

                const fetchedUsers = response.body.data.getUsers as User[];
                const fetchedUsersIDs = fetchedUsers.map( mapID );

                const usersToCheck = users.map( mapID );

                expect( users ).toHaveLength( 15 );

                usersToCheck.forEach( userID =>
                {
                    expect( fetchedUsersIDs ).toContain( userID );
                } )
            } )

    } );

    it( 'modifyUser mutation', async () =>
    {
        const user = await userFactory();
        const token = user.createToken();

        const query = `
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

        return api
            .post( '/users/graphql' )
            .set( HEADER_TOKEN_KEY, token.value )
            .send( {
                query,
                variables: {
                    id:   user.id.toString(),
                    user: input
                }
            } )
            .then( response =>
            {
                const user = response.body.data.updateUser as UserInterface;

                expect( user.email ).toEqual( input.email );
                expect( user.name ).toEqual( input.name );
            } )

    } );

} );
