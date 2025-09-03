import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventType } from "@/pages/home/components/types";
import AddEventButton from "@/pages/home/components/AddEventButton";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([
    { title: "DOMI 시작", date: "2025-09-03" },
  ]);

  const handleAddEventClick = () => {
    console.log("Add Event button clicked!");
  };

  return (
    <div>
      {/* Step 1: 버튼 추가 */}
      <AddEventButton onClick={handleAddEventClick} />

      {/* FullCalendar */}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};

export default Calendar;
