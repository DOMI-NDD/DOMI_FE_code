// src/axsios/calendarApi.ts
import type { EventType } from "@/pages/home/components/types";
import axios from "axios";

// 공통 axsios 인스턴스
const axsios = axios.create({
  baseURL: "http://13.209.77.82:8080",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwic3ViIjoibCIsImlhdCI6MTc1OTMwMzU5NywiZXhwIjoxNzU5OTA4Mzk3fQ.hvn1tsvL2nyCssU6Vx1AQ2vdllJhQF-Mpco4HjOUjZ0"
  },
});

// 백엔드 → 프론트 매핑
const mapFromBackend = (data: any): EventType => ({ 
  id: data.id,
  title: data.title,
  startDate: data.startDate,
  endDate: data.endDate,
  content: data.detail, // detail → content
});

// 프론트 → 백엔드 매핑
const mapToBackend = (event: Partial<EventType>) => ({
  id: event.id,
  title: event.title,
  startDate: event.startDate,
  endDate: event.endDate,
  detail: event.content, // content → detail
});

// 일정 전체 조회
export const fetchEvents = async (year: any, month: any): Promise<EventType[]> => {
  console.log("년도" + year)
  console.log("월" + month)
  // let now = new Date();
  // let year = now.getFullYear();
  // let month = now.getMonth()+1;
  if(month <= 10){
    String(month).replaceAll("0", "");
  }
  const { data } = await axsios.get(`/calendars?year=${year}&month=${month}`);
  return data.map(mapFromBackend);
};

// 일정 생성
export const createEvent = async (event: Omit<EventType, "id">) => {
  await axsios.post("/calendars", mapToBackend(event));
};

// 일정 수정
export const updateEvent = async (id: string, event: Partial<EventType>) => {
  await axsios.put(`/calendars/${id}`, mapToBackend(event));
};

// 일정 삭제
export const deleteEvent = async (id: string): Promise<void> => {
  await axsios.delete(`/calendars/${id}`);
};