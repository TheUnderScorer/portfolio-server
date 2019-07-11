import { Result } from 'express-validator/check';
import { ErrorMessage } from '../types/ErrorMessage';
import { ErrorCodes } from '../types/ErrorCodes';

export default class RequestError extends Error
{

    public readonly statusCode: number = 400;
    public readonly name: string = '';
    public readonly previous: Error = null;
    public messages: ErrorMessage[] = [];

    /**
     * @constructor RequestError constructor
     *
     * @param {string} message Error message
     * @param {string} errorCode Error code that describes it
     * @param {string} statusCode Optional status code that will be sent with request
     * @param {Error} previous Instance of previous error
     *
     * */
    constructor( message: string, errorCode: string, statusCode: number = 400, previous: Error = null )
    {
        super( message );

        this.name = errorCode;
        this.statusCode = statusCode;
        this.previous = previous;
    }

    /**
     * @method Creates error instance from validation result
     * */
    public static fromValidationError( result: Result ): RequestError
    {

        const self = new this( 'Invalid request fields.', 'VALIDATION_ERROR' );

        self.messages = result.array().map( ( item ) =>
        {
            delete item.location;

            return {
                msg:   item.msg,
                code:  ErrorCodes.InvalidRequestField,
                field: item.field
            };
        } );

        return self;

    }

}
