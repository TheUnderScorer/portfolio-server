import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { DateFormats } from '../../../types/DateFormats';
import { ConversationStatuses } from '../types/ConversationInterface';
import { sendEmail } from '../../../common/emails';

export default async ( conversation: Conversation, targetEmail: string ): Promise<void> =>
{
    const messages = await conversation.messages;

    let transcript = '';

    for ( const message of messages ) {
        transcript += handleMessage( message );
    }

    if ( conversation.status === ConversationStatuses.closed ) {
        transcript += 'Conversation have been closed.'
    }

    await sendEmail( {
        to:      targetEmail,
        bcc:     process.env.DEV_MAIL,
        subject: `Chat transcript from conversation #${ conversation.id }`,
        text:    transcript,
    } );
}

/**
 * Provides transcript string for given message
 * */
const handleMessage = async ( message: Message ): Promise<string> =>
{
    const author = await message.author;

    const { content, createdAt } = message;

    return `[${ createdAt.format( DateFormats.DateTime ) }] - ${ author.name }: 
        ${ content }
    `
};
