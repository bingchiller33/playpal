"use client";

import { ISquad } from "@/models/squadModel";
import { NextPageProps, WithId } from "@/utils/types";
import io, { Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { create_message, getChat } from "./SquadChat.server";
import { IChat } from "@/models/chatModel";
import { useSession } from "next-auth/react";
import styles from "./SquadChat.module.css";
import cx from "classnames";

const SquadChat = (props: NextPageProps) => {
  const { id, page } = props.params;
  const [messages, setMessages] = useState<IChat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: session } = useSession();

  const fetchMessages = async () => {
    const response = await getChat(id);
    if (typeof response !== "undefined") {
      setMessages(response.data);
    }
  };

  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(fetchMessages, 3000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [id]);

  const handleSendMessage = async () => {
    if (typeof session?.user.id !== "undefined") {
      await create_message(id, session?.user.id, newMessage.trim());
    }
    setNewMessage("");
    fetchMessages();
  };

  return (
    <div className={cx(styles["chat-container"])}>
      <div className={cx(styles["messages-container"])}>
        {messages.map((msg) => (
          <div style={{"width":"100%", "alignItems":"flex-end"}}>
            {msg.account_id?._id.toString() !== session?.user.id ? (
              <div className={cx(styles["message-box-left"])}>
                <img
                  src={msg.account_id?.avatar_url}
                  className={cx(styles["avatar"])}
                  alt="avatar"
                />
                <span className={cx(styles["message-text-left"])}>
                  {msg.text}
                </span>
              </div>
            ) : (
              <div className={cx(styles["message-box-right"])}>
                <span className={cx(styles["message-text-right"])}>
                  {msg.text}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className={cx(styles["message-input"])}
      />
      <button onClick={handleSendMessage} className={cx(styles["send-button"])}>
        Send
      </button>
    </div>
  );
};

export default SquadChat;
