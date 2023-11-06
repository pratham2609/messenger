'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import React, { useRef } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"

interface BodyProps {
    initialMessages: FullMessageType[]
}
const Body: React.FC<BodyProps> = ({
    initialMessages
}) => {
    const [messages, setMessages] = React.useState(initialMessages)
    const bottomRef = useRef<HTMLDivElement>(null)
    const { conversationId } = useConversation()
    React.useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])
    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox isLast={i === messages.length - 1} data={message} key={i} />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    )
}

export default Body