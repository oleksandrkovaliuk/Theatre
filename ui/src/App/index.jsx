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
import { UserContext } from "../context/userInfoContext";
import { CreateEventPage } from "../pages/creatingEventPage";
import { NotificationContext } from "../context/notificationContext";
import { MageneEvents } from "../pages/manegeEventsPage";
import { NotificationProvider } from "../context/NotificationProvider";
import { BookEvent } from "../pages/bookEventPage";
import { UserBookedEvents } from "../pages/userBookedEvents";
import { Toaster } from "sonner";
import { NextUIProvider } from "@nextui-org/system";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/user/userCheckLogin";
import { userFetch } from "../store/thunks/user/loginUser";
import { fetchEvents, storeEvents } from "../store/reducers/event/getEvent";

export const App = () => {
  const dispatch = useDispatch();

  const { setNotificationMessage } = useContext(NotificationContext);
  // const [events, setEvents] = useState(null);
  // const [userInfo, setUserInfo] = useState(null);

  // // User info
  // const userContextValue = useMemo(() => {
  //   return { user: userInfo, setUserInfo };
  // }, [userInfo]);
  // // Events info
  // const eventsContextValue = useMemo(
  //   () => ({
  //     events,
  //     setCommingEvents: setEvents,
  //   }),
  //   [events]
  // );

  const getAllData = useCallback(async () => {
    try {
      const [userRes, eventsRes] = await Promise.allSettled([
        checkLoginned(),
        getEvents(),
      ]);
      dispatch(setUser(userRes.value));
      dispatch(storeEvents(eventsRes.value));
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [setNotificationMessage, dispatch]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);
  return (
    <NextUIProvider>
      {/* <UserContext.Provider value={userContextValue}> */}
      {/* <EventsContext.Provider value={eventsContextValue}> */}
      <NotificationProvider>
        <Toaster richColors />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<UnfoundPage />} />
          <Route path="/createEvent" element={<CreateEventPage />} />
          <Route path="/manageEvents" element={<MageneEvents />} />
          <Route path="/bookEvent" element={<BookEvent />} />
          <Route path="/historyOfBookedEvents" element={<UserBookedEvents />} />
        </Routes>
      </NotificationProvider>
      {/* </EventsContext.Provider> */}
      {/* </UserContext.Provider> */}
    </NextUIProvider>
  );
};
