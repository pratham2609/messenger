import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher"

interface IParams {
    conversationId?: string
};
export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        const { conversationId } = params
        const currentUser = await getCurrentUser()
        if (!currentUser?.id) return new NextResponse('Unauthorized', { status: 400 })
        const existingConersation = await prisma.conversation.findUnique(
            {
                where: {
                    id: conversationId
                },
                include: {
                    users: true
                }
            }
        )
        if (!existingConersation) return new NextResponse('Invalid Id', { status: 400 })
        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            },
        })
        existingConersation.users.forEach((user) => {
            if (user?.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConersation)
            }
        })
        return NextResponse.json(deletedConversation)
    } catch (error: any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE')
        return new NextResponse('Internal Server error', { status: 500 })
    }
}