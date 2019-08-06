import { gql } from 'apollo-server';

const schema = gql`
    extend type User @key(fields: "_id") {
        _id: ID! @external
        conversations: [Conversation]
    }

    type Conversation @key(fields: "_id") {
        _id: ID!
        title: String
        user: User
    }

    input ConversationInput {
        title: String
    }

    extend type Mutation {
        createConversation(userID: ID, conversation: ConversationInput): Conversation
    }
`;

export default schema;
