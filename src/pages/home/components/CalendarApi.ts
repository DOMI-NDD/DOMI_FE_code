// src/axsios/calendarApi.ts
import type { EventType } from "@/pages/home/components/types";
import axios from "axios";

const accessToken = localStorage.getItem("accessToken");

// 공통 axsios 인스턴스
const axsios = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`
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
  if(month <= 10){
    String(month).replaceAll("0", "");
  }
  const { data } = await axsios.get(`/calendars?year=${year}&month=${month}`) ;
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