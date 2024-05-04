import { useCallback, useMemo, useState } from "react";
import { NotificationContext } from "./notificationContext";
import { toast } from "sonner";
export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [error, setIsError] = useState(false);
  const [currentMassage, setCurrentMessage] = useState(null);

  const handleSetNotification = useCallback((mess, type) => {
    if (mess.toString().includes("Error")) {
      setMessage(mess.toString().split(":").pop());
      setCurrentMessage(mess.toString().split(":").pop());
      setIsError(true);
      toast.error(mess.toString().split(":").pop(), {
        position: window.innerWidth > 768 ? "bottom-right" : "top-right",
        style: { padding: "15px 10px", border: "1px solid var(--color-red)" },
      });
    } else {
      setMessage(mess.toString());
      setCurrentMessage(mess.toString());
      setIsError(false);
      if (type === "success") {
        toast.success(mess.toString(), {
          position: window.innerWidth > 768 ? "bottom-right" : "top-right",
          style: { padding: "15px 10px" },
        });
      } else if (type === "info") {
        toast.info(mess.toString(), {
          position: window.innerWidth > 768 ? "bottom-right" : "top-right",
          style: { padding: "15px 10px" },
        });
      } else if (type === "warning") {
        toast.warning(mess.toString(), {
          position: window.innerWidth > 768 ? "bottom-right" : "top-right",
          style: { padding: "15px 10px" },
        });
      }
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
      setNotificationMessage: (mess, type) => handleSetNotification(mess, type),
    };
  }, [currentMassage, error, message, handleSetNotification]);

  return (
    <NotificationContext.Provider value={messageValue}>
      {children}
    </NotificationContext.Provider>
  );
};
