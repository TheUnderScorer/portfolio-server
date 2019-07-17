export default class Exception extends Error
{

    public constructor( message: string, name: string = 'Error' )
    {
        super( message );

        this.name = name;
    }

}
