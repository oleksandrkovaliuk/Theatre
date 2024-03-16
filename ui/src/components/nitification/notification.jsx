import React, { useContext } from "react";
import n from "./notification.module.scss";
import { NotificationContext } from "../../context/notificationContext";
import { Error } from "../../icons/error";
import { Message } from "../../icons/message";

export const Notification = () => {
  const { messageError, currentMessage, notificationMessage } =
    useContext(NotificationContext);
  return (
    <div
      style={notificationMessage ? { top: "2%" } : { top: "-10%" }}
      className={n.notification_block}
    >
      <div className={n.notification_text}>
        {messageError ? <Error /> : <Message />}
        <p>{currentMessage}</p>
      </div>
    </div>
  );
};
