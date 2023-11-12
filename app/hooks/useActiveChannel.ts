import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";

const useActiveChannel = () => {
    const { set, add, remove } = useActiveList();
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
    // listen to all people joining or leaving channel to remove them from global active list

    useEffect(() => {
        let channel = activeChannel;

        if (!channel) {
            channel = pusherClient.subscribe('presence-messenger');
            setActiveChannel(channel);
        }

        channel.bind("pusher:subscription_succeeded", (members: Members) => {
            const initialMembers: string[] = [];
            // members is not something normal it is of type pusher so we have to do it like this by using each

            members.each((member: Record<string, any>) => initialMembers.push(member.id));
            set(initialMembers);
        });

        channel.bind("pusher:member_added", (member: Record<string, any>) => {
            add(member.id)
        });

        channel.bind("pusher:member_removed", (member: Record<string, any>) => {
            remove(member.id);
        });

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe('presence-messenger');
                setActiveChannel(null);
            }
        }
    }, [activeChannel, set, add, remove]);
}

export default useActiveChannel;