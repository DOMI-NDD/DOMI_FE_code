import { useState } from 'react';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

type EventType = {title : string; date : string};

export default function Calendar() {
  const [events, setEvents] = useState<EventType[]>([
    {title : 'DOMI Project 시작', date : '2025-09-03'}
  ])

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      events={events}
    />
  );
}