import BaseResponse from './BaseResponse';
import RequestError from '../errors/RequestError';
import { ErrorMessage } from '../types/ErrorMessage';
import { ErrorCodes } from '../types/ErrorCodes';

/**
 * @class Class that acts as base for error related responses
 * */
export default class ErrorResponse extends BaseResponse
{

    public readonly error: boolean = true;
    public messages: ErrorMessage[] = [];
    public stack: string = null;
    public errorData: Error = null;

    public static fromError( error: Error ): ErrorResponse
    {

        const self = new this();

        const { message, name } = error;
        const isDev = process.env.NODE_ENV === 'development';

        if ( ( error instanceof RequestError ) ) {

            if ( error.messages.length ) {
                self.messages = error.messages;
            } else {
                self.addMessage( error.message, name );
            }

        } else {

            self.addMessage( message );

            if ( isDev ) {
                self.errorData = error;
            }

        }

        if ( isDev ) {
            self.stack = error.stack;
        }

        return self;
    }

    public addMessage( msg: string, code: ErrorCodes | string = '', field: string = '' )
    {
        this.messages.push( {
            msg, code, field
        } );

        return this;
    }
}
