// src/axsios/calendarApi.ts
import type { EventType } from "@/pages/home/components/types";
import axios from "axios";

// 공통 axsios 인스턴스
const axsios = axios.create({
  baseURL: "http://13.209.77.82:8080", // 👉 너가 갖고 있는 baseURL 넣기
  headers: {
    "Content-Type": "application/json",
    Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwic3ViIjoiYSIsImlhdCI6MTc1OTIyNDU3NywiZXhwIjoxNzU5MjI1NDc3fQ.IfJPiJCx8X_S-lapJjzFOcQL6-1lLm641IDkWBKg6Y4"
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
export const fetchEvents = async (): Promise<EventType[]> => {
  const { data } = await axsios.get("/calendars");
  return data.map(mapFromBackend);
};

// 일정 생성
export const createEvent = async (event: Omit<EventType, "id">): Promise<EventType> => {
  const { data } = await axsios.post("/calendars", mapToBackend(event));
  return mapFromBackend(data);
};

// 일정 수정
export const updateEvent = async (id: string, event: Partial<EventType>): Promise<EventType> => {
  const { data } = await axsios.put(`/calendars/${id}`, mapToBackend(event));
  return mapFromBackend(data);
};

// 일정 삭제
export const deleteEvent = async (id: string): Promise<void> => {
  await axsios.delete(`/calendars/${id}`);
};