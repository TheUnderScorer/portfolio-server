import * as faker from 'faker'
import User from '../../services/user/models/User';
import { UserRole } from '../../services/user/types/UserRole';

export type UserFactory = {
    name?: string;
    role?: UserRole;
    password?: string;
    ip?: string;
}

const userFactory = async (
    {
        name = faker.name.firstName(),
        role = UserRole.user,
        password = faker.internet.password(),
        ip = faker.internet.ip()
    }: UserFactory = {}
): Promise<User> =>
{
    const user = User.create( { name, role, password, ip } );
    await user.save();

    return user;
};

export default userFactory
