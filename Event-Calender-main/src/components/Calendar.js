import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isToday } from "date-fns";
import DayCell from "./DayCell";
import { DragDropContext } from "react-beautiful-dnd";
import { useEventContext } from "../context/EventContext";
import EventFilterBar from "./EventFilterBar";
import "./Calendar.css";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { events, updateEvent } = useEventContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Get all unique categories/colors for filter
  const categories = Array.from(new Set(events.map(e => e.color || "Other")));

  // Filter and search events
  const filteredEvents = events.filter(e => {
    const matchesCategory = !filter || (e.color === filter);
    const matchesSearch = !search || (
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
    );
    return matchesCategory && matchesSearch;
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const event = events.find(e => e.id === draggableId);
    if (!event) return;
    // Update event date to the destination day
    const newDate = new Date(destination.droppableId);
    const oldDate = new Date(event.startDateTime);
    const newStart = new Date(newDate.setHours(oldDate.getHours(), oldDate.getMinutes()));
    updateEvent({ ...event, startDateTime: newStart.toISOString().slice(0,16) });
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{"<"}</button>
      <span>{format(currentMonth, "MMMM yyyy")}</span>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{">"}</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="calendar-day-label" key={i}>
          {format(addDays(date, i), "EEE")}
        </div>
      );
    }
    return <div className="calendar-days-row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        days.push(
          <DayCell
            key={day}
            day={cloneDay}
            isCurrentMonth={isSameMonth(day, monthStart)}
            isToday={isToday(day)}
            events={filteredEvents}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-container">
      <EventFilterBar
        onFilter={setFilter}
        onSearch={setSearch}
        categories={categories}
      />
      {renderHeader()}
      {renderDays()}
      <DragDropContext onDragEnd={onDragEnd}>
        {renderCells()}
      </DragDropContext>
    </div>
  );
};

export default Calendar;
