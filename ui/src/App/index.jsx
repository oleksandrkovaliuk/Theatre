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
import { checkLoginned, getEvents } from "../services/apiCallConfig";
import { EventsContext } from "../context/eventsContext";
import { userContext } from "../context/userInfoContext";
import { CreateEventPage } from "../pages/creatingEventPage";
import { NotificationContext } from "../context/notificationContext";
import { MageneEvents } from "../pages/manegeEventsPage";
import { NotificationProvider } from "../context/NotificationProvider";
import { BookEvent } from "../pages/bookEventPage";
import { UserBookedEvents } from "../pages/userBookedEvents";
import { Toaster } from "sonner";
import { NextUIProvider } from "@nextui-org/system";
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
      const [userRes, eventsRes] = await Promise.allSettled([
        checkLoginned(),
        getEvents(),
      ]);
      setUserInfo(userRes.value);
      console.log(eventsRes.value);
      setEvents(eventsRes.value);
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [setNotificationMessage]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);
  return (
    <NextUIProvider>
      <userContext.Provider value={userContextValue}>
        <EventsContext.Provider value={eventsContextValue}>
          <NotificationProvider>
            <Toaster richColors />
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<UnfoundPage />} />
              <Route path="/createEvent" element={<CreateEventPage />} />
              <Route path="/manageEvents" element={<MageneEvents />} />
              <Route path="/bookEvent" element={<BookEvent />} />
              <Route path="/userBookedEvents" element={<UserBookedEvents />} />
            </Routes>
          </NotificationProvider>
        </EventsContext.Provider>
      </userContext.Provider>
    </NextUIProvider>
  );
};
