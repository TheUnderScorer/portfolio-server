import { GraphQLError } from 'graphql';
import { BAD_REQUEST } from 'http-status';

export default ( error: GraphQLError ) =>
{
    const originalError = error.originalError as any;

    return {
        message:    error.message,
        code:       originalError ? error.originalError.name : error.name,
        statusCode: originalError && originalError.statusCode ? originalError.statusCode : BAD_REQUEST
    };
}
