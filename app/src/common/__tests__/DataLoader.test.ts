import ModelInterface from '../../types/ModelInterface';
import DataLoader from '../DataLoader';

describe( 'DataLoader', () =>
{

    let model: ModelInterface & any;
    let loader: DataLoader<number, ModelInterface & any>;

    beforeEach( () =>
    {
        model = {
            id: 1,
        };

        loader = new DataLoader( () => Promise.resolve( [ model ] ) );
    } );

    it( 'save method', async () =>
    {
        const saveResult = await loader.save( () => Promise.resolve( model ) );
        expect( saveResult.id ).toEqual( model.id );

        const fetchedResult = await loader.load( model.id );
        expect( fetchedResult.id ).toEqual( model.id );
    } );

    it( 'saveMany method', async () =>
    {
        const models: ModelInterface[] = [
            {
                id: 1,
            },
            {
                id: 2,
            },
            {
                id: 3
            }
        ];

        loader.saveMany( models );

        for ( const model of models ) {
            const loadedModel = await loader.load( model.id );

            expect( loadedModel.id ).toEqual( model.id );
        }
    } );

    it( 'update method', async () =>
    {
        model.test = false;

        loader.prime( model, model.id );

        const loadedModel = await loader.load( model.id );
        expect( loadedModel.test ).toBeFalsy();

        model.test = true;
        loader.update( model );

        const modelAfterUpdate = await loader.load( model.id );
        expect( modelAfterUpdate.test ).toBeTruthy();
    } );

} );
