import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"
interface IParams {
    conversationId?: string
}
export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const currrentUser = await getCurrentUser()
        const { conversationId } = params;
        if (!currrentUser?.id || !currrentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        // find existing convo
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    include: { seen: true }
                },
                users: true
            }
        })
        if (!conversation) return new NextResponse('Invalid ID', { status: 400 })

        //finding last message
        const lastMessage = conversation.messages[conversation.messages.length - 1]

        if (!lastMessage) return NextResponse.json(conversation)

        // updated seen of last message
        const updatedMessage = await prisma.message.update({
            where: { id: lastMessage.id },
            include: {
                seen: true,
                sender: true
            }, data: {
                seen: {
                    connect: {
                        id: currrentUser.id
                    }
                }
            }
        })
        return NextResponse.json(updatedMessage)
    } catch (error) {
        console.log(error, 'ERROR_MESSAGES_SEEN')
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}