import { BaseEntity } from 'typeorm';

export default async <Model extends BaseEntity>( count: number, factory: ( args: any ) => Promise<Model>, args: any = {} ): Promise<Model[]> =>
{
    let result: Model[] = [];

    for ( let i = 0; i < count; i++ ) {
        const model: Model = await factory( args );

        result.push( model );
    }

    return result;
}
