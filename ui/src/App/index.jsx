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
import { NotificationProvider } from "../context/NotificationProvider";
export const App = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const [events, setEvents] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // User info
  const userContextValue = useMemo(() => {
    return { user: userInfo, setUserInfo };
  }, [userInfo]);
  // Events info
  const eventsContextValue = useMemo(
    () => ({
      events,
      setCommingEvents: setEvents,
    }),
    [events]
  );

  const getAllData = useCallback(async () => {
    try {
      const [userRes, eventsRes] = await Promise.all([
        checkUserLoginned(),
        getEvents(),
      ]);
      setUserInfo(userRes.user);
      setEvents(eventsRes.events);
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [setNotificationMessage]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);
  return (
    <userContext.Provider value={userContextValue}>
      <EventsContext.Provider value={eventsContextValue}>
        <NotificationProvider>
          <Notification />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<UnfoundPage />} />
            <Route path="/createEvent" element={<CreateEventPage />} />
            <Route path="/manageEvents" element={<MageneEvents />} />
          </Routes>
        </NotificationProvider>
      </EventsContext.Provider>
    </userContext.Provider>
  );
};
