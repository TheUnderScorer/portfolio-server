import UserInput from './UserInput';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class UpdateUserInput extends UserInput
{

    @Field( () => ID )
    public id: number;

}
