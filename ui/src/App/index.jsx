import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "../components/header";
import { Route, Routes } from "react-router-dom";
import { UnfoundPage } from "../pages/404unfoundPage";
import { HomePage } from "../pages/homePage";
import { checkUserWithJwtToke, getEvents } from "../services/apiCallConfig";
import { EventsContext } from "../context/EventsContext";
import { userContext } from "../context/userInfoContext";
export const App = () => {
  const [events, setEvents] = useState(null);
  const [user, setUserInfo] = useState(null);
  // User info
  const userContextValue = useMemo(() => {
    return { user: user, setUserInfo: (info) => setUserInfo(info) };
  }, [user]);
  // Events info
  const eventsContextValue = useMemo(
    () => ({
      event: events,
      setCommingEvents: (data) => setEvents(data),
    }),
    [events]
  );
  // Working with events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      setEvents(res.events);
    } catch (error) {
      console.error("failed with caling for events");
    }
  }, []);
  // Working with user info
  const getUserInfo = useCallback(async () => {
    try {
      const jwtToken = localStorage.getItem("user_jwt_token");
      if (jwtToken?.length && user === null) {
        const res = await checkUserWithJwtToke({
          jwt_token: JSON.parse(jwtToken),
        });
        setUserInfo(res.user);
      }
    } catch (error) {
      console.error(error, "something wrong with getting user onloading");
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
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<UnfoundPage />} />
        </Routes>
      </EventsContext.Provider>
    </userContext.Provider>
  );
};
