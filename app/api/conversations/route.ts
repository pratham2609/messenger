import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorised', { status: 404 })
        }
        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Invalid Data', { status: 400 })
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include: { // populate can be done using include
                    users: true
                }
            })
            return NextResponse.json(newConversation);
        }

        // we dont check exisiting convo for a group but we check for a member

        // checking existing conversation for a user
        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser?.id, userId]
                        }
                    }, {
                        userIds: {
                            equals: [userId, currentUser?.id]
                        }
                    }
                ]
            }
        })
        const singleConversation = existingConversations[0];
        if (singleConversation) {
            return NextResponse.json(singleConversation)
        }
        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser?.id
                        }, {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        })
        return NextResponse.json(newConversation)

    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}