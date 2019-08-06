import { getOffset } from '../pagination';

describe( 'pagination', () =>
{

    it( 'getOffset should return correct offset', () =>
    {
        const page = 2;
        const perPage = 15;

        const offset = getOffset( page, perPage );

        expect( offset ).toEqual( 15 );
    } );

} );
