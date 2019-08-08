export enum ErrorCodes
{
    ServerError                       = 'ServerError',
    InvalidRequestField               = 'InvalidRequestField',
    InvalidRoutePath                  = 'InvalidRoutePath',
    InvalidToken                      = 'InvalidToken',
    AccountLimitExceeded              = 'AccountLimitExceeded',
    CannotEditUser                    = 'CannotEditUser',
    NoEmailProvided                   = 'NoEmailProvided',
    EmailSendingError                 = 'EmailSendingError',
    ContactFormOverload               = 'ContactFormOverload',
    CannotOpenConversation            = 'CannotOpenConversation',
    CannotOpenMoreThanOneConversation = 'CannotOpenMoreThanOneConversation',
    MissingEmailForTranscript         = 'MissingEmailForTranscript'
}
