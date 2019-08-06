import { connection } from '../db';
import AppConfig from '../types/AppConfig';

export default async ( config: AppConfig ) =>
{
    console.log( 'Performing cleanup after test...' );

    for ( let entity of config.entities ) {

        try {
            const repo = connection.getRepository( entity.name );

            await repo.delete( {} );
        } catch ( e ) {

        }

    }
}
