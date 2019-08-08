import { ApolloServer } from 'apollo-server';
import User from '../../../../user/models/User';
import { graphql, GraphQLSchema } from 'graphql';
import setupTests, { testsConfig } from '../../../../../tests/setupTests';
import userFactory from '../../../../../tests/factories/userFactory';
import afterEveryTest from '../../../../../tests/afterEveryTest';
import ConversationInterface, { ConversationStatuses } from '../../../types/ConversationInterface';
import ConversationInput from '../../inputs/ConversationInput';
import * as faker from 'faker';
import conversationFactory from '../../../../../tests/factories/conversationFactory';
import Conversation from '../../../models/Conversation';
import Result from '../../../../../graphql/objects/Result';
import { contextWithUser } from '../../../../../tests/contextProviders';
import ChangeConversationStatusInput from '../../inputs/ChangeConversationStatusInput';
import events from '../../../../../events';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';

let sentTranscripts: MailOptions[] = [];

jest.mock( '../../../../../common/emails', () => ( {
    sendEmail: async ( options: MailOptions ) =>
               {
                   sentTranscripts.push( options );

                   return true;
               }
} ) );

describe( 'ConversationMutations', () =>
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

        sentTranscripts = [];
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
            contextValue:   contextWithUser( user ),
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
            contextValue:   contextWithUser( user ),
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
            contextValue:   contextWithUser( user ),
            variableValues: {
                id: conversation.id,
            }
        } );

        const { result } = res.data.deleteConversation as Result;

        expect( result ).toBeTruthy();
        expect( await Conversation.findOne( conversation.id ) ).toBeUndefined();
    } );

    it( 'changeStatus mutation', async () =>
    {
        const conversation = await conversationFactory( { author: user } );

        const mutation = `
            mutation ChangeStatus($input: ChangeConversationStatusInput!) {
                changeStatus(input: $input){
                    id,
                    status
                }
            }
        `;

        const input: ChangeConversationStatusInput = {
            id:     conversation.id,
            status: ConversationStatuses.closed
        };

        await graphql( {
            schema,
            source:         mutation,
            contextValue:   contextWithUser( user ),
            variableValues: {
                input
            }
        } );

        await conversation.reload();

        expect( conversation.status ).toEqual( ConversationStatuses.closed );
    } );

    it( 'changeStatus should send transcript and trigger event', async ( done ) =>
    {
        const conversation = await conversationFactory( { author: user } );

        events.on( 'app.conversation.transcriptSent', ( conv: Conversation ) =>
        {
            expect( conv.id ).toEqual( conversation.id );

            expect( sentTranscripts[ 0 ].to ).toEqual( user.email );
            expect( sentTranscripts[ 0 ].subject ).toContain( conversation.id );

            done();
        } );

        const input: ChangeConversationStatusInput = {
            id:             conversation.id,
            status:         ConversationStatuses.closed,
            sendTranscript: true,
        };

        const mutation = `
            mutation ChangeStatus($input: ChangeConversationStatusInput!) {
                changeStatus(input: $input){
                    id,
                    status
                }
            }
        `;

        await graphql( {
            schema,
            source:         mutation,
            contextValue:   contextWithUser( user ),
            variableValues: {
                input
            }
        } );
    } );

} );
