import { ErrorMessage } from '../types/ErrorMessage';

export default class SocketError extends Error
{

    public messages: ErrorMessage[] = [];

    public constructor( message: string, name: string = 'Socket Error' )
    {
        super( message );

        this.name = name;
    }

}
