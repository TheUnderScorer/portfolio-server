import Exception from './Exception';

export default class RequestError extends Exception
{

    public readonly statusCode: number = 400;

    /**
     * @constructor RequestError constructor
     *
     * @param {string} message Error message
     * @param {string} name Error code that describes it
     * @param {string} statusCode Optional status code that will be sent with request
     *
     * */
    constructor( message: string, name: string, statusCode: number = 400 )
    {
        super( message, name );

        this.statusCode = statusCode;
    }

}
