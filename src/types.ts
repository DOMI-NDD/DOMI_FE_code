export type EventType = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  content?: string;
};


export type NewEventSingleInput = {
  title: string;
  startDate: string;
  endDate: string;
  content?: string;
}

export type NewEventRangeInput = {
  title: string;
  startDate: string;
  endDate: string;
  content?: string;
}




export interface ItemType {
  id: number;
  title: string;
  detail: string;
  writer: string,
  createdAt: string, 
}