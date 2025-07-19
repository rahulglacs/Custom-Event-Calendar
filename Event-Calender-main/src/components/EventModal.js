import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useEventContext } from "../context/EventContext";
import { hasConflict } from "../utils/conflict";

const defaultEvent = {
  id: null,
  title: "",
  description: "",
  startDateTime: "",
  endDateTime: "",
  recurrence: "none",
  color: "#3182ce"
};

const recurrenceOptions = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" }
];

const EventModal = ({ isOpen, onClose, onSave, onDelete, initialEvent, day }) => {
  const [event, setEvent] = useState(defaultEvent);
  const [conflict, setConflict] = useState(false);
  const { events } = useEventContext();

  useEffect(() => {
    if (initialEvent) setEvent(initialEvent);
    else setEvent({ ...defaultEvent, startDateTime: day ? format(day, "yyyy-MM-dd'T'HH:mm") : "" });
  }, [initialEvent, day, isOpen]);

  useEffect(() => {
    setConflict(hasConflict(event, events));
  }, [event, events]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!event.title || !event.startDateTime || conflict) return;
    onSave({ ...event, id: event.id || Date.now().toString() });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{event.id ? "Edit Event" : "Add Event"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Title<input name="title" value={event.title} onChange={handleChange} required /></label>
          <label>Date & Time<input type="datetime-local" name="startDateTime" value={event.startDateTime} onChange={handleChange} required /></label>
          <label>Description<textarea name="description" value={event.description} onChange={handleChange} /></label>
          <label>Recurrence<select name="recurrence" value={event.recurrence} onChange={handleChange}>{recurrenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></label>
          <label>Color<input type="color" name="color" value={event.color} onChange={handleChange} /></label>
          {conflict && <div style={{color: 'red'}}>Event conflicts with another event!</div>}
          <div className="modal-actions">
            <button type="submit" disabled={conflict}>Save</button>
            {event.id && <button type="button" onClick={() => onDelete(event.id)} className="delete-btn">Delete</button>}
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
