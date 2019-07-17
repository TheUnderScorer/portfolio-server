import User from '../../models/User';
import { getOffset } from '../../../../common/pagination';

export default async ( { page = 1, perPage = 15 } ) =>
{
    return await User.find( {
        skip: getOffset( page, perPage ),
        take: perPage,
    } );
}
