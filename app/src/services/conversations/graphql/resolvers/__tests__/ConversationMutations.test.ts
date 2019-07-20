import { ApolloServer } from 'apollo-server';
import User from '../../../../user/models/User';
import { graphql, GraphQLSchema } from 'graphql';
import setupTests, { testsConfig } from '../../../../../tests/setupTests';
import { HEADER_TOKEN_KEY } from '../../../../../constants/request';
import { loaders } from '../../../../../graphql/getContext';
import userFactory from '../../../../../tests/factories/userFactory';
import afterEveryTest from '../../../../../tests/afterEveryTest';
import ConversationInterface from '../../../types/ConversationInterface';
import ConversationInput from '../../inputs/ConversationInput';
import * as faker from 'faker';
import conversationFactory from '../../../../../tests/factories/conversationFactory';
import Conversation from '../../../models/Conversation';
import DeleteConversationResult from '../../objects/DeleteConversationResult';

describe( 'ConversationMutations', () =>
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

    it( 'createConversation mutation', async () =>
    {
        const mutation = `
            mutation CreateConversation($input: ConversationInput!) {
                createConversation(conversationInput: $input) {
                    id,
                    title,
                    author {
                        id,
                        name
                    }
                }
            }
        `;

        const input: ConversationInput = {
            title: faker.random.word()
        };

        const result = await graphql( {
            schema,
            source:         mutation,
            contextValue:   config.contextProvider( {} ),
            variableValues: {
                input
            }
        } );

        const conversation = result.data.createConversation as ConversationInterface;
        const { title, author } = conversation;

        expect( title ).toEqual( input.title );
        expect( ( await author ).id.toString() ).toEqual( user.id.toString() );
    } );

    it( 'updateConversation mutation', async () =>
    {
        const conversation = await conversationFactory( { author: user } );

        const mutation = `
            mutation UpdateConversation($id: ID!, $input: ConversationInput!) {
                updateConversation(id: $id, conversationInput: $input) {
                    id,
                    title,
                    author {
                        id,
                        name
                    }
                }
            }
        `;

        const input: ConversationInput = {
            title: faker.random.word()
        };

        const result = await graphql( {
            schema,
            source:         mutation,
            contextValue:   config.contextProvider( {} ),
            variableValues: {
                input,
                id: conversation.id,
            }
        } );

        const updatedConversation = result.data.updateConversation as ConversationInterface;
        const { title } = updatedConversation;

        expect( title ).toEqual( input.title );
    } );

    it( 'deleteConversation mutation', async () =>
    {
        const conversation = await conversationFactory( { author: user } );

        const mutation = `
            mutation DeleteConversation($id: ID!) {
                deleteConversation(id: $id) {
                    result,
                }
            }
        `;

        const res = await graphql( {
            schema,
            source:         mutation,
            contextValue:   config.contextProvider( {} ),
            variableValues: {
                id: conversation.id,
            }
        } );

        const { result } = res.data.deleteConversation as DeleteConversationResult;

        expect( result ).toBeTruthy();
        expect( await Conversation.findOne( conversation.id ) ).toBeUndefined();
    } )

} );
