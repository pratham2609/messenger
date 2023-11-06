import { Conversation, Message, User } from "@prisma/client";


// made the types as we populated the data and the defined types can be incompatibles
export type FullMessageType = Message & {
    sender: User,
    seen: User[]
}

export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMessageType[]
}