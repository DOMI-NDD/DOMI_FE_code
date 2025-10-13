import type { EventType } from "@/pages/home/components/types";
import axios from "axios";

// 공통 axsios 인스턴스
const axsios = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

//요청 인터셉터
axsios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);

//응답 인터셉터
axsios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          alert("요청 형식이 잘못되었습니다.");
          break;
      }
    }
    return Promise.reject(error);
  }
);

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