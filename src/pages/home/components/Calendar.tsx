import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventType } from "@/pages/home/components/types";
import EventModal from "@/pages/home/components/EventModal";
import { fetchEvents, createEventsInRange, updateEvent, deleteEvent } from "@/pages/home/components/CalendarApi";
import styled from "@emotion/styled";
import type { DateClickArg } from "@fullcalendar/interaction";
import interactionPlugin from "@fullcalendar/interaction";
import { Id } from "@/pages/login/LoginCompnent";

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //클릭된 날짜 셀들 정보
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  //각 모달들 open 상태
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //CreateModal 입력 상태
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  const [startYear, setStartYear] = useState<string>("");
  const [startMonth, setStartMonth] = useState<string>("");
  const [startDay, setStartDay] = useState<string>("");

  const [endYear, setEndYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endDay, setEndDay] = useState<string>("");
  
  const close = () => {
    setIsListModalOpen(false);
    setIsCreateModalOpen(false);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(false);
    setFormTitle("");
    setFormContent("");
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchEvents();
        console.log("fetchEvents 결과:", data);
        if (mounted) {
          setEvents(data);
        }
      } catch (e) {
        if (mounted) {
          setError("일정을 불러오지 못했습니다.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        } 
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  //유틸 함수
  const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const isValidYMD = (y: number, m: number, d:number) => {
    if(!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)){
      return false;
    }
    if(m < 1 || m > 12){
      return false;
    }
    if(d < 1 || d > 31){
      return false;
    }
    const t = new Date(y, m - 1, d);
    return t.getFullYear() === y && t.getMonth() === m - 1 && t.getDate() === d;
  }

  const ymdToISO = (y: string, m: string, d: string) => {
    const yi = parseInt(y, 10);
    const mi = parseInt(m, 10);
    const di = parseInt(d, 10);

    if(!isValidYMD(yi, mi, di)){
      return null;
    }
    return `${yi}-${pad2(mi)}-${pad2(di)}`;
  }

  const compareISO = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

  const fillYMD = (iso: string) => {
    const [yy, mm, dd] = iso.split("-");
    setStartYear(yy);
    setStartMonth(mm);
    setStartDay(dd);

    setEndYear(yy);
    setEndMonth(mm);
    setEndDay(dd);
  }

  const handleDayClick = (info: any) => {
    setSelectedDate(info.dateStr);
    fillYMD(info.dateStr);
    setIsListModalOpen(true);
  }

  //이미 저장된 이벤트들의 날짜와 선택된 날짜를 비교해서 같은 날짜만 반환
  const listForSelectedDate = useMemo(() => {
    return selectedDate ? events.filter((e) => e.startDate <= selectedDate && e.endDate >= selectedDate) : [];
  }, [events, selectedDate]);

  const openDetail = (id: string) => {
    setSelectedEventId(id);
    setIsDetailModalOpen(true);
  }

  const selectedEvent = useMemo(() => {
    return listForSelectedDate.find((e) => e.id === selectedEventId);
  }, [listForSelectedDate, selectedEventId])

  const openCreateFromList = () => {
    if (selectedDate){
      fillYMD(selectedDate);
    }
    setIsCreateModalOpen(true);
  }

   const handleCreate = async () => {
    const startISO = ymdToISO(startYear, startMonth, startDay);
    const endISO   = ymdToISO(endYear, endMonth, endDay);

    if(!startISO || !endISO){
      alert("시작/종료 날짜를 다시 확인해주세요.");
      return;
    }
    if(compareISO(startISO, endISO) === 1){
      alert("종료 날짜가 시작 날짜보다 빠를 수 없습니다.");
      return;
    }
    if(!formTitle.trim() || !formContent.trim()){
      alert("제목과 내용 입력은 필수입니다.");
      return
    }

    const newEvents = await createEventsInRange({
      startDate: startISO,
      endDate: endISO,
      title: formTitle,
      content: formContent,
    });

    setEvents((prev) => [...prev, ...newEvents])

    setStartYear("");
    setStartMonth("");
    setStartDay("");

    setEndYear("");
    setEndMonth("");
    setEndDay("");

    setFormTitle("");
    setFormContent("");

    setIsCreateModalOpen(false);
  }

  const closeCreateModal = () => {
    setFormTitle("");
    setFormContent("");
    setIsCreateModalOpen(false);
  }

  const openEditFromDetail = () => {
    if(!selectedEvent){
      return
    }
    setIsEditModalOpen(true)

    setFormTitle(selectedEvent.title ?? "");
    setFormContent(selectedEvent.content ?? "");
  }

  const handleSaveEdit = () => {
    if(!selectedEvent){
      return
    }

    const contentTrim = (formContent || "").trim();
    if (contentTrim === "") {
      alert("일정의 내용을 비울 수는 없습니다.");
      return;
    }

    const updated = {
      ...selectedEvent,
      title: selectedEvent.title,
      content: contentTrim,
    };

    //DB에 저장하기 위한 요청
    updateEvent(updated);
    //상태 갱신을 위한 업데이트
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    
    setIsEditModalOpen(false);
  }

  const handleDeleteFromEdit = () => {
    if(!selectedEvent){
      return;
    }

    deleteEvent(selectedEvent.id);
    setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
  }

  return(<>
      {/*임시 로딩, 에러 메세지*/}
      {loading && <p style={{ margin: "8px 0" }}>불러오는 중…</p>}
      {error && <p style={{ margin: "8px 0", color: "crimson" }}>{error}</p>}

      {(isListModalOpen || isDetailModalOpen || isCreateModalOpen || isEditModalOpen) && (<Backdrop/>)}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map(e => ({
          id: e.id,
          title: e.title,
          content: e.content,
          start: e.startDate,
          end: e.endDate,
        }))}
        dateClick={handleDayClick}
      />

      <EventModal
        isOpen={isListModalOpen}
        onClose={close}  
      >
        {listForSelectedDate.map((e) => (
          <ListModalEventContainer key={e.id} onClick={() => openDetail(e.id)}>
            <ListModalEventBox>
              <ListModalEventTItle>{e.title}</ListModalEventTItle>
              <ListModalEventContent>{e.content ?? "내용 없음"}</ListModalEventContent>
            </ListModalEventBox>
          </ListModalEventContainer>
        ))}
        <ButtonBox>
          <Button backColor="#A7A7A7" onClick={close}>닫기</Button>
          <Button backColor="#6D71FF" onClick={openCreateFromList}>추가</Button>
        </ButtonBox>
      </EventModal>

      <EventModal
        isOpen={isDetailModalOpen}
        onClose={close}
      >
        <ModalTitle>{selectedEvent?.title}</ModalTitle>
        <DetailModalContent>{selectedEvent?.content ?? "내용 없음"}</DetailModalContent> {/* 이벤트 내용 없으면 "내용 없음" 표시*/}
        <ButtonBox>
          <Button backColor="#A7A7A7" onClick={close}>닫기</Button>
          <Button backColor="#6D71FF" onClick={openEditFromDetail}>수정/삭제</Button>
        </ButtonBox>
      </EventModal>

      <EventModal
        isOpen={isCreateModalOpen}
        onClose={close}
      >
        <NewEventTitleInput 
          placeholder="제목 입력"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        ></NewEventTitleInput>
        <TextBox>
          <Title></Title>
          <Content></Content>
        </TextBox>
        <DateInputContainer>
          <DateInputBox>
            <DateLabel>년</DateLabel>
            <DateInput
              placeholder="년도 입력"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value.replace(/\D/g, ""))}
              min={1900}
              max={9999}
            ></DateInput>
          </DateInputBox>
          <DateInputBox>
            <DateLabel>월</DateLabel>
            <DateInput
              placeholder="월 입력"
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value.replace(/\D/g, ""))}
              min={1}
              max={12}
            ></DateInput>
          </DateInputBox>
          <DateInputBox>
            <DateLabel>일</DateLabel>
            <DateInput
              placeholder="일 입력"
              value={startDay}
              onChange={(e) => setStartDay(e.target.value.replace(/\D/g, ""))}
              min={1}
              max={31}
            ></DateInput>
          </DateInputBox>
        </DateInputContainer>

          {/* ~ 추가 해야함*/}

        <DateInputContainer>
          <DateInputBox>
            <DateLabel>년</DateLabel>
            <DateInput
              placeholder="년도 입력"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value.replace(/\D/g, ""))}
              min={1900}
              max={9999}
            ></DateInput>
          </DateInputBox>
          <DateInputBox>
            <DateLabel>월</DateLabel>
            <DateInput
              placeholder="월 입력"
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value.replace(/\D/g, ""))}
              min={1}
              max={12}
            ></DateInput>
          </DateInputBox>
          <DateInputBox>
            <DateLabel>일</DateLabel>
            <DateInput
              placeholder="일 입력"
              value={endDay}
              onChange={(e) => setEndDay(e.target.value.replace(/\D/g, ""))}
              min={1}
              max={31}
            ></DateInput>
          </DateInputBox>
        </DateInputContainer>

        <TextBox>
          <Title></Title>
          <Content></Content>
        </TextBox>

        <NewEventContentInput
          placeholder="내용 입력"
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
        ></NewEventContentInput>

        <ButtonBox>
          <Button backColor="#A7A7A7" onClick={closeCreateModal}>취소</Button>
          <Button backColor={
            formTitle.trim() && formContent.trim() &&
            startDay.trim() && startMonth.trim() && startYear.trim() &&
            endDay.trim() && endMonth.trim() && endYear.trim() ? "#6D71FF" : "#A7A7A7"
          }>등록</Button>
        </ButtonBox>
      </EventModal>

      <EventModal
        isOpen={isEditModalOpen}
        onClose={close}
      >
        <ModalTitle>{selectedEvent?.title}</ModalTitle>
        <EditContentArea
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
          placeholder="내용"
        ></EditContentArea>
        <ButtonBox>
          <Button backColor="#A7A7A7" onClick={close}>닫기</Button>
          <Button backColor="#FF7474" onClick={handleDeleteFromEdit}>삭제</Button>
          <Button backColor={formContent.trim() ? "#6D71FF" : "#A7A7A7"} onClick={handleSaveEdit}>저장</Button>
        </ButtonBox>
      </EventModal>
  </>)
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100; /* 모달보다 낮아야 함 */
`;

const ListModalEventContainer = styled.div`
  box-sizing: border-box;
  border: 1px solid #939393;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  height: calc(100vh * 100 / 1080);
  width:  calc((100vh * 100 / 1080) * (604 / 100));
  cursor: pointer;
`

const ListModalEventBox = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ListModalEventTItle = styled.span`
  font-size: clamp(15px, 1.04vw, 19px);
  font-weight: 500;
`

const ListModalEventContent = styled.span`
  font-size: clamp(12px, 0.83vw, 15px);
  font-weight: 400;
  color: #939393;
`

const ButtonBox = styled.div`
  display: flex;
  gap: 24px;
`

const Button = styled.button<{backColor: string}>`
  box-sizing: border-box;
  border: none;
  height: calc(100vh * 60 / 1080);
  width:  calc((100vh * 60 / 1080) * (160 / 60));
  background-color: ${({ backColor }) => backColor || "#A7A7A7"};
  cursor: pointer;
  color: #ffffff;
  font-size: clamp(18px, 0.78vw, 23px);
  font-weight: 500;
  border-radius: 8px;
`

const ModalTitle = styled.h2`
  font-weight: 500;
  font-size: clamp(30px, 2.08vw, 38px);
`

const DetailModalContent = styled.span`
  box-sizing: border-box;
  font-size: clamp(18px, 1.25vw, 23px);
  font-weight: 500;
  height: calc(100vh * 615 / 1080);
  width:  calc((100vh * 615 / 1080) * (604 / 615));
`

const EditContentArea = styled.input`
  box-sizing: border-box;
  font-size: clamp(18px, 1.25vw, 23px);
  font-weight: 500;
  height: calc(100vh * 615 / 1080);
  width:  calc((100vh * 615 / 1080) * (604 / 615));
`

const DateInputContainer = styled.div`
  display: flex;
`

const DateInputBox = styled.div`
  display: flex;
  flex-direction: column;
`

const DateLabel = styled.label`
  
`

const DateInput = styled.input`
  
`

const NewEventTitleInput = styled.input`
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #939393;
  height: calc(100vh * 56 / 1080);
  width:  calc((100vh * 56 / 1080) * (500 / 56));
  font-size: clamp(24px, 1.67vw, 30px);
  font-weight: 500;
`

const NewEventContentInput = styled.input`
  box-sizing: border-box;
  font-size: clamp(15px, 1.04vw, 19px);
  height: calc(100vh * 254 / 1080);
  width:  calc((100vh * 254 / 1080) * (604 / 254));
  border: 1px solid #939393;
  border-radius: 8px;
`

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.span`
  
`
const Content = styled.span`
  
`
export default Calendar