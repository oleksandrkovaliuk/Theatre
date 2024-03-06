import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Header } from "../components/header";
import { Route, Routes } from "react-router-dom";
import { UnfoundPage } from "../pages/404unfoundPage";
import { HomePage } from "../pages/homePage";
import { getEvents } from "../services/apiCallConfig";
import { EventsContext } from "../context/EventsContext";
export const App = () => {
  const [events, setEvents] = useState(null);
  const eventsContextValue = useMemo(
    () => ({
      event:events,
      setCommingEvents: (data) => setEvents(data),
    }),
    [events]
  );
  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      setEvents(res.events);
    } catch (error) {
      console.error("failed with caling for events");
    }
  }, []);
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  return (
    <EventsContext.Provider value={eventsContextValue}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<UnfoundPage />} />
      </Routes>
    </EventsContext.Provider>
  );
};
