import React, {
  useCallback,
  useContext,
  useEffect,
} from "react";
import { Header } from "../components/header";
import { Route, Routes } from "react-router-dom";
import { UnfoundPage } from "../pages/404unfoundPage";
import { HomePage } from "../pages/homePage";
import { CreateEventPage } from "../pages/creatingEventPage";
import { NotificationContext } from "../context/notificationContext";
import { MageneEvents } from "../pages/manegeEventsPage";
import { NotificationProvider } from "../context/NotificationProvider";
import { BookEvent } from "../pages/bookEventPage";
import { UserBookedEvents } from "../pages/userBookedEvents";
import { Toaster } from "sonner";
import { NextUIProvider } from "@nextui-org/system";
import { useDispatch } from "react-redux";
import { fetchEvents } from "../store/thunks/events";
import { checkUserLogin } from "../store/thunks/user/checkUserLogin";

export const App = () => {
  const dispatch = useDispatch();

  const { setNotificationMessage } = useContext(NotificationContext);

  const getAllData = useCallback(async () => {
    try {
      dispatch(checkUserLogin());
      dispatch(fetchEvents());
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [setNotificationMessage, dispatch]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);
  return (
    <NextUIProvider>
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
    </NextUIProvider>
  );
};
