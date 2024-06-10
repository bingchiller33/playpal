"use client";

import { ISquad } from "@/models/squadModel";
import { NextPageProps, WithId } from "@/utils/types";
import io, { Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { create_message, getChat } from "./SquadChat.server";
import { IChat } from "@/models/chatModel";
import { useSession } from "next-auth/react";




const SquadChat = (props: NextPageProps) => {
  const { id, page } = props.params;
  const [messages, setMessages] = useState<IChat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession()

  const fetchMessages = async () => {
    const response = await getChat(id);
    if(typeof response !== 'undefined'){
      setMessages(response.data);
    }
  };

  useEffect(() => {

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 3000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [id]);


  const handleSendMessage = async () => {
    if(typeof session?.user.id !== 'undefined'){
        await create_message(id, session?.user.id, newMessage.trim())
    }
    setNewMessage('');
    fetchMessages();
  };

  return(
    <div>
      <div>
        {messages.map((msg) => (
          <div >
            <span>{msg.account_id?.username}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  )
};  

export default SquadChat;
