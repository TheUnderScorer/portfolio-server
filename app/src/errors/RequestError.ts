import Exception from './Exception';

export default class RequestError extends Exception
{

    public readonly statusCode: number = 400;

    constructor( message: string, name: string = 'Error', statusCode: number = 400 )
    {
        super( message, name );

        this.statusCode = statusCode;
    }

}
