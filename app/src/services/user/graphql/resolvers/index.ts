import updateUser from './updateUser';
import createUser from './createUser';
import getUser from './getUser';
import getUsers from './getUsers';

export default {
    Query:    {
        getUser,
        getUsers
    },
    Mutation: {
        updateUser,
        createUser,
    }
}
