import Model from '../../models/Model';
import * as DataLoader from 'dataloader';

/**
 * Loads provided array of entities into associated DataLoader
 * */
export const loadMany = <Entity extends Model>(
    models: Entity[],
    keyRetriever: ( entity: Entity ) => string,
    loader: DataLoader<string, Entity>,
) =>
{
    models.forEach( model =>
    {
        const key = keyRetriever( model );

        loader.prime( key, model );
    } )
};
