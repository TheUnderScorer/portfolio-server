import TokenInterface from '../../types/Token';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Token implements TokenInterface
{
    @Field()
    public expires: string;

    @Field()
    public value: string;
}
