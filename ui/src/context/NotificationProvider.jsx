import { useCallback, useMemo, useState } from "react";
import { NotificationContext } from "./notificationContext";

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [error, setIsError] = useState(false);
  const [currentMassage, setCurrentMessage] = useState(null);

  const handleSetNotification = useCallback((mess) => {
    if (mess.toString().includes("Error")) {
      setMessage(mess.toString().split(":").pop());
      setCurrentMessage(mess.toString().split(":").pop());
      setIsError(true);
    } else {
      setMessage(mess.toString());
      setCurrentMessage(mess.toString());
      setIsError(false);
    }

    if (mess) {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  }, []);

  const messageValue = useMemo(() => {
    return {
      messageError: error,
      currentMessage: currentMassage,
      notificationMessage: message,
      setNotificationMessage: handleSetNotification,
    };
  }, [currentMassage, error, message, handleSetNotification]);

  return (
    <NotificationContext.Provider value={messageValue}>
      {children}
    </NotificationContext.Provider>
  );
};
