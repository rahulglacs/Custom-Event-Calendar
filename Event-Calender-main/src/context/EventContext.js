import React, { createContext, useContext, useState, useEffect } from "react";

const EventContext = createContext();

export const useEventContext = () => useContext(EventContext);

const EVENT_STORAGE_KEY = "calendar_events";

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(EVENT_STORAGE_KEY);
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = (event) => setEvents((prev) => [...prev, event]);
  const updateEvent = (updated) => setEvents((prev) => prev.map(e => e.id === updated.id ? updated : e));
  const deleteEvent = (id) => setEvents((prev) => prev.filter(e => e.id !== id));

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};
