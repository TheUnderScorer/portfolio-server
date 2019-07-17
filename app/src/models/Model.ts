import { BaseEntity } from 'typeorm';

abstract class Model extends BaseEntity
{

    public toJSON(): any
    {
        return Object.assign( {}, this );
    }

}

export default Model;
