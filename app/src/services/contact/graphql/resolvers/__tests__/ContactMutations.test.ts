import setupTests, { testsConfig } from '../../../../../tests/setupTests';
import { createLoaders } from '../../../../../graphql/getContext';
import { HEADER_TOKEN_KEY } from '../../../../../constants/request';
import { ApolloServer } from 'apollo-server';
import User from '../../../../user/models/User';
import { graphql, GraphQLSchema } from 'graphql';
import userFactory from '../../../../../tests/factories/userFactory';
import ContactInput from '../../inputs/ContactInput';
import * as faker from 'faker';
import ContactInterface from '../../../types/ContactInterface';
import afterEveryTest from '../../../../../tests/afterEveryTest';
import Contact from '../../../models/Contact';

jest.mock( '../../../common/sendContact', () => ( {
    default: async ( contact: Contact ) =>
             {
                 sendEmails.push( contact );

                 return true;
             }
} ) );

let server: ApolloServer;
let user: User;
let schema: GraphQLSchema;
let sendEmails: ContactInterface[] = [];

describe( 'ContactMutations', () =>
{

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
        await afterEveryTest( testsConfig );

        sendEmails = []
    } );

    it( 'Should save and send contact via e-mail', async () =>
    {
        const input: ContactInput = {
            subject: faker.random.word(),
            content: faker.random.words( 10 )
        };

        const mutation = `
            mutation ContactMutation ($input: ContactInput!) {
                send(contactInput: $input) {
                    id,
                }
            }
        `;

        const res = await graphql( {
            schema,
            source:         mutation,
            variableValues: {
                input
            },
            contextValue:   config.contextProvider( {} )
        } );

        const { data } = res;

        expect( sendEmails[ 0 ].id.toString() ).toEqual( data.send.id.toString() );
    } )

} );
