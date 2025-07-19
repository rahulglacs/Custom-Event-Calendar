import React, { useState } from "react";
import { format } from "date-fns";
import { useEventContext } from "../context/EventContext";
import EventModal from "./EventModal";
import { occursOnDay } from "../utils/recurrence";
import { Droppable, Draggable } from "react-beautiful-dnd";
import "./DayCell.css";

const DayCell = ({ day, isCurrentMonth, isToday, events: propEvents }) => {
  const { events: contextEvents, addEvent, updateEvent, deleteEvent } = useEventContext();
  const events = propEvents || contextEvents;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Show events that occur on this day, including recurring events
  const dayEvents = events.filter(e => occursOnDay(e, day));

  const handleDayClick = (e) => {
    if (e.target.classList.contains("event-item")) return;
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleSave = (event) => {
    if (editingEvent) updateEvent(event);
    else addEvent(event);
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (id) => {
    deleteEvent(id);
    setModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <Droppable droppableId={day.toISOString()}>
      {(provided, snapshot) => (
        <div
          className={`day-cell${isCurrentMonth ? "" : " not-current-month"}${isToday ? " today" : ""}`}
          onClick={handleDayClick}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <span className="day-number">{format(day, "d")}</span>
          <div className="events-list">
            {dayEvents.map((ev, idx) => (
              <Draggable draggableId={ev.id} index={idx} key={ev.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="event-item"
                    style={{
                      background: ev.color || "#3182ce",
                      ...provided.draggableProps.style
                    }}
                    onClick={(e) => handleEventClick(ev, e)}
                    title={ev.title}
                  >
                    {ev.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          <EventModal
            isOpen={modalOpen}
            onClose={() => { setModalOpen(false); setEditingEvent(null); }}
            onSave={handleSave}
            onDelete={handleDelete}
            initialEvent={editingEvent}
            day={day}
          />
        </div>
      )}
    </Droppable>
  );
};

export default DayCell;
