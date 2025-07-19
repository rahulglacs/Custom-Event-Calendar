import React from "react";
import Calendar from "./components/Calendar";
import { EventProvider } from "./context/EventContext";
import "./App.css";
import "./components/EventModal.css";

function App() {
  return (
    <EventProvider>
      <div className="app-container">
        <h1>Event Calendar</h1>
        <Calendar />
      </div>
    </EventProvider>
  );
}

export default App;
