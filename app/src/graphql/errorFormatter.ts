import { GraphQLError } from 'graphql';
import { BAD_REQUEST } from 'http-status';

export default ( error: GraphQLError ) =>
{
    const { name = error.name, statusCode = BAD_REQUEST, validationErrors = [] } = error.extensions.exception;

    let message = '';

    if ( validationErrors.length ) {
        message = validationErrors.map( mapValidationError ).join( ', ' );
    } else {
        message = error.message;
    }

    return {
        message,
        name,
        statusCode
    };
}

const mapValidationError = <Err extends any>( error: Err ): string =>
{
    return Object.values( error.constraints ).join( ', ' );
};
