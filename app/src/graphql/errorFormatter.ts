import { GraphQLError } from 'graphql';
import { BAD_REQUEST } from 'http-status';

export default ( error: GraphQLError ) =>
{
    const { name = error.name, statusCode = BAD_REQUEST } = error.extensions.exception;

    return {
        message: error.message,
        name,
        statusCode
    };
}
