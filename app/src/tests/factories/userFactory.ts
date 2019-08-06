import * as faker from 'faker'
import User from '../../services/user/models/User';
import { UserRole } from '../../services/user/types/UserRole';
import UserInterface from '../../services/user/types/UserInterface';

export interface UserFactory extends Partial<UserInterface>
{
    name?: string;
    role?: UserRole;
    password?: string;
    ip?: string;
    email?: string;
}

const userFactory = async (
    {
        name = faker.name.firstName(),
        role = UserRole.user,
        email = faker.internet.email(),
        password = faker.internet.password(),
        ip = faker.internet.ip()
    }: UserFactory = {}
): Promise<User> =>
{
    const user = User.create( { name, role, password, ip, email } );
    await user.save();

    return user;
};

export default userFactory
