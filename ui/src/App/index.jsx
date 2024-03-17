import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Header } from "../components/header";
import { Route, Routes } from "react-router-dom";
import { UnfoundPage } from "../pages/404unfoundPage";
import { HomePage } from "../pages/homePage";
import { checkUserLoginned, getEvents } from "../services/apiCallConfig";
import { EventsContext } from "../context/eventsContext";
import { userContext } from "../context/userInfoContext";
import { CreateEventPage } from "../pages/creatingEventPage";
import { NotificationContext } from "../context/notificationContext";
import { Notification } from "../components/nitification";
import { MageneEvents } from "../pages/manegeEventsPage";
export const App = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const [events, setEvents] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentMassage, setCurrentMessage] = useState(null);
  const [error, isError] = useState(false);
  // User info
  const userContextValue = useMemo(() => {
    return { user: userInfo, setUserInfo: (info) => setUserInfo(info) };
  }, [userInfo]);
  // Events info
  const eventsContextValue = useMemo(
    () => ({
      event: events,
      setCommingEvents: (data) => setEvents(data),
    }),
    [events]
  );

  const messageValue = useMemo(() => {
    return {
      messageError: error,
      currentMessage: currentMassage,
      notificationMessage: message,
      setNotificationMessage: (mess) => {
        if (mess.toString().includes("Error")) {
          setMessage(mess.toString().split(":").pop());
          setCurrentMessage(mess.toString().split(":").pop());
          isError(true);
        } else {
          setMessage(mess.toString());
          setCurrentMessage(mess.toString());
          isError(false);
        }

        if (mess) {
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        }
      },
    };
  }, [message]);

  // Working with events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      setEvents(res.events);
    } catch (error) {
      setNotificationMessage(error);
    }
  }, []);
  // Working with user info
  const getUserInfo = useCallback(async () => {
    try {
      const res = await checkUserLoginned();
      setUserInfo(res.user);
    } catch (error) {
      setNotificationMessage(error);
    }
  }, []);
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  // on page loading
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  return (
    <userContext.Provider value={userContextValue}>
      <EventsContext.Provider value={eventsContextValue}>
        <NotificationContext.Provider value={messageValue}>
          <Notification />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<UnfoundPage />} />
            <Route path="/createEvent" element={<CreateEventPage />} />
            <Route path="/manageEvents" element={<MageneEvents />} />
          </Routes>
        </NotificationContext.Provider>
      </EventsContext.Provider>
    </userContext.Provider>
  );
};
