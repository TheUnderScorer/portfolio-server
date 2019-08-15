import * as BaseLoader from 'dataloader';
import ModelInterface from '../types/ModelInterface';

export default class DataLoader<K, V extends ModelInterface> extends BaseLoader<K, V>
{

    /**
     * Saves value in loader. Value is retrieved using given callback function.
     * */
    public async save( callback: ( instance: this ) => Promise<V> ): Promise<V>
    {
        const model = await callback( this );

        this.prime( model.id as any, model );

        return model;
    }

    public update( model: V ): this
    {
        this
            .clear( model.id as any, )
            .prime( model.id as any, model );

        return this;
    }

    public saveMany( models: V[] ): this
    {
        models.forEach( model => this.prime( model.id as any, model ) );

        return this;
    }

}


