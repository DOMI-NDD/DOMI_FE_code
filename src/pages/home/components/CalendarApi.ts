// src/pages/home/components/CalendarApi.tsx
import type {
  EventType,
  NewEventSingleInput,
  NewEventRangeInput,
} from "@/pages/home/components/types";

// 실제 서버 전환 시:
// const BASE = "/api/calendar";
// export async function fetchEvents(): Promise<EventType[]> {
//   const res = await fetch(`${BASE}/events`, { credentials: "include" });
//   if (!res.ok) throw new Error("Failed to fetch");
//   return res.json();
// }

const LS_KEY = "domi:events:mock-server";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── 로컬 스토어 유틸 ───────────────────────────────────────────
function readStore(): EventType[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const seed: EventType[] = [
        { id: "seed-1", title: "회의", startDate: "2025-09-02", endDate: "2025-09-02", content: "팀 회의가 있습니다." },
        { id: "seed-2", title: "DOMI 시작", startDate: "2025-09-03", endDate: "2025-09-03", content: "프로젝트 킥오프" },
      ];
      localStorage.setItem(LS_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

function writeStore(next: EventType[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
}

// ── 헬퍼: ID, 날짜 ────────────────────────────────────────────
function genId() {
  return (globalThis.crypto && "randomUUID" in globalThis.crypto)
    ? (globalThis.crypto as any).randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
}

function pad(n: number) { return String(n).padStart(2, "0"); }
function toIso(y: number, m: number, d: number) { return `${y}-${pad(m)}-${pad(d)}`; }

function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return toIso(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
}

// ── API (Mock) ────────────────────────────────────────────────
export async function fetchEvents(): Promise<EventType[]> {
  await delay(120);
  return readStore();
}

export async function fetchEventsByDate(date: string): Promise<EventType[]> {
  await delay(100);
  return readStore().filter(e => e.startDate <= date && e.endDate >= date);
}

export async function getEventById(id: string): Promise<EventType> {
  await delay(100);
  const found = readStore().find(e => e.id === id);
  if (!found) throw new Error("Not found");
  return found;
}

export async function createEvent(input: NewEventSingleInput): Promise<EventType> {
  await delay(120);
  const newEvent: EventType = { id: genId(), ...input };
  const next = [...readStore(), newEvent];
  writeStore(next);
  return newEvent;
}

// 포함 범위(inclusive): startDate ~ endDate 각각 하루씩 이벤트 생성
export async function createEventsInRange(input: NewEventRangeInput): Promise<EventType[]> {
  await delay(150);
  const { title, content, startDate, endDate } = input;

  if (startDate > endDate) throw new Error("Invalid range");

  const newEvent: EventType = {
    id: genId(),
    title,
    startDate,
    endDate,
    content,
  };

  const next = [...readStore(), newEvent];
  writeStore(next);
  return [newEvent];
}

export async function updateEvent(updated: EventType): Promise<EventType> {
  await delay(120);
  const store = readStore();
  const idx = store.findIndex(e => e.id === updated.id);
  if (idx < 0) throw new Error("Not found");
  store[idx] = { ...store[idx], ...updated };
  writeStore(store);
  return store[idx];
}

export async function deleteEvent(id: string): Promise<void> {
  await delay(100);
  writeStore(readStore().filter(e => e.id !== id));
}
