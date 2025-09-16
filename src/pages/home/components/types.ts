export type EventType = {
  id: string;
  title: string;
  date: string;
  content?: string;
}

export type NewEventSingleInput = {
  title: string;
  date: string;
  content?: string;
}

export type NewEventRangeInput = {
  title: string;
  startDate: string;
  endDate: string;
  content?: string;
}