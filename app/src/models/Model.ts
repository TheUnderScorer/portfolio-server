import { BaseEntity } from 'typeorm';

abstract class Model extends BaseEntity
{

    public toJSON(): any
    {
        const json = Object.assign( {}, this );

        Object.entries( json ).forEach( ( [ key, value ] ) =>
        {
            if ( typeof value !== 'object' ) {
                return;
            }

            if ( value instanceof Model ) {
                json[ key ] = value.toJSON();
            }
        } );

        return json;
    }

}

export default Model;
