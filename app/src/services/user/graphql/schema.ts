import { buildSchema } from 'graphql';

const schema = buildSchema( `
    type User {
        id: ID!
        name: String
        lastLogin: String
        role: String
        ip: String
        email: String
        password: String
    }
    
    input UserInput {
        name: String
        password: String
        email: String
    }
    
    type Token {
        value: String
        expires: String
    }
    
    type UserWithToken{
        user: User
        token: Token
    }
   
    type Query {
        getUser(id: ID!): User
        getUsers(perPage: Int, page: Int): [User]
    }
    
    type Mutation {
        createUser(user: UserInput): UserWithToken
        updateUser(id: ID!, user: UserInput): User
    }
` );

export default schema;
