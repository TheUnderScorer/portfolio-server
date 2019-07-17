import { connection, entities } from '../db';

export default async () =>
{
    console.log( 'Performing cleanup after test...' );

    for ( let entity of entities ) {

        try {
            const repo = connection.getRepository( entity.name );

            await repo.clear();
        } catch ( e ) {

        }

    }
}
