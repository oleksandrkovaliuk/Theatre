import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "../components/header";
import { Route, Routes } from "react-router-dom";
import { UnfoundPage } from "../pages/404unfoundPage";
import { HomePage } from "../pages/homePage";
import { checkUserLoginned, getEvents } from "../services/apiCallConfig";
import { EventsContext } from "../context/EventsContext";
import { userContext } from "../context/userInfoContext";
export const App = () => {
  const [events, setEvents] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  // User info
  const userContextValue = useMemo(() => {
    return { user: userInfo, setUserInfo: (info) => setUserInfo(info) };
  }, [userInfo]);
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
      if (jwtToken?.length && userInfo === null) {
        const res = await checkUserLoginned({
          jwt_token: JSON.parse(jwtToken),
        });
        setUserInfo(res.user);
      }
    } catch (error) {
      console.error(error, "something wrong with getting user onloading");
    }
  }, [userInfo]);
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
