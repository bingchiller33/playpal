"use client";

import { NextPageProps, WithId } from "@/utils/types";
import { useState, useEffect, useRef } from "react";
import { create_message, getChat } from "./SquadChat.server";
import { IChat } from "@/models/chatModel";
import { useSession } from "next-auth/react";
import styles from "./SquadChat.module.css";
import cx from "classnames";
import { FaImage, FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";

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
  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(fetchMessages, 3000); 

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
    <div style={{"height":"100%", "backgroundColor":"#1F1E1E", "overflowY":"hidden", "position":"relative"}}>
    <div className={cx(styles["chat-container"])}>
      <div className={cx(styles["messages-container"])}>
        {messages.map((msg) => (
          <div style={{"width":"100%", "alignItems":"flex-end"}}>
            {msg.account_id?._id.toString() !== session?.user.id ? (
              <div className={cx(styles["message-box-left"])}>
                <img
                  src={msg.account_id?.avatar}
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
      
    </div>
    <div className={cx(styles["input-container"])} >
      <FaMicrophone fill="#ED154C" style={{"width":"5%", "height":"auto", "padding":"3px", "margin": "0 1%"}} />
      <FaImage fill="#ED154C" style={{ "width":"5%", "height":"auto", "margin": "0 1%"}} />
        <input
          type="text"
          placeholder="Type something here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cx(styles["message-input"])}
        />
        <button onClick={handleSendMessage} className={cx(styles["send-button"])}>
          <svg viewBox="0 0 24 24">
            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SquadChat;
