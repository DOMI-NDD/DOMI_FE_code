import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventType } from "@/pages/home/components/types";
import EventModal from "@/pages/home/components/EventModal";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "@/pages/home/components/CalendarApi";
import styled from "@emotion/styled";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarStyle.css";
import Arrow from "@/assets/arrow.png"
import ModalArrow from "@/assets/modalArrow.png"

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //클릭된 날짜 셀들 정보
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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
    let [ , mm, dd] = info.dateStr.split("-");
    if(mm[0] === "0"){
      mm = mm[1];
    }
    if(dd[0] == "0"){
      dd = dd[1];
    }
    setSelectedMonth(mm);
    setSelectedDay(dd);
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
    if(!formTitle.trim()){
      alert("제목 입력은 필수입니다.");
      return
    }

    const newEvents = await createEvent({
      startDate: startISO,
      endDate: endISO,
      title: formTitle,
      content: formContent,
    });

    setEvents((prev) => [...prev, newEvents])

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
    setFormContent(selectedEvent.content ?? "내용 없음");
  }

  const handleSaveEdit = () => {
    if(!selectedEvent){
      return
    }

    const TitleTrim = (formTitle || "").trim();
    if (TitleTrim === "") {
      alert("일정의 제목을 비울 수는 없습니다.");
      return;
    }

    const updated = {
      ...selectedEvent,
      title: TitleTrim,
      content: formContent,
    };

    //DB에 저장하기 위한 요청
    updateEvent(updated.id, {
      title: updated.title,
      content: updated.content,
    });
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

      <div className="calendar-wrapper">
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
        fixedWeekCount={false} 
        headerToolbar={{
            start: "",     // 왼쪽: 이전 버튼
            center: "title",   // 가운데: 제목
            end: ""        // 오른쪽: 다음 버튼
            // today 버튼은 아예 안 넣음
        }}
        displayEventTime={false} // 시간 표시 안함
        dayCellClassNames={(info) => {
          const hasEvent = events.some((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);

            // 시간 없애고 날짜만 비교
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            const cell = new Date(info.date);
            cell.setHours(0, 0, 0, 0);

            return cell >= start && cell <= end;
          });

          return hasEvent ? ["has-event"] : [];
        }}
        titleFormat={() => ""}
        // @ts-ignore
        //위 주석 타입 에러 무시용 언젠가 고칠 예정
        
        datesSet={(arg) => {
          const currentDate = arg.view.currentStart;
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;

          const titleEl = document.querySelector(".fc-toolbar-title");
          if (titleEl) {
            titleEl.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 20px;">
                <span style="font-size: 36px; font-weight: 700;">${year}</span>
                <div style="box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; gap: 20px; font-size: 40px; font-weight: 700; width:964px; padding: 0px 50px;">
                  <img src="${Arrow}" class="fc-prev-btn" style="cursor: pointer; width: 10px; height: 16px; transform: rotate(180deg);" />
                  <span>${month}월</span>
                  <img src="${Arrow}" class="fc-next-btn" style="cursor: pointer; width: 10px; height: 16px;" />
                </div>
              </div>
            `;

            titleEl.querySelector(".fc-prev-btn")?.addEventListener("click", () => {
              arg.view.calendar.prev();
            });
            titleEl.querySelector(".fc-next-btn")?.addEventListener("click", () => {
              arg.view.calendar.next();
            });
          }
        }}
        // 요일은 영어
        dayHeaderFormat={{ weekday: "short" }}
        dayCellContent={(arg) => {
          return { html: `<div class="day-circle">${arg.date.getDate()}</div>` };
        }}
      />
      </div>

      <EventModal
        isOpen={isListModalOpen}
        onClose={close}  
      >
        <ModalTitle>{selectedMonth}월 {selectedDay}일</ModalTitle>
        <ListModalEventContainer>
          {listForSelectedDate.map((e) => (
            <ListModalEventBox key={e.id} onClick={() => openDetail(e.id)}>
              <ListModalEventInfoBox>
                <ListModalEventTItle>{e.title}</ListModalEventTItle>
                <ListModalEventContent>{e.content 
                  ? e.content.length > 20
                    ? e.content.slice(0, 20) + "..."
                    : e.content 
                : "내용 없음"}
                </ListModalEventContent>
              </ListModalEventInfoBox>
              <img src={ModalArrow} style={{width: "calc(100vh * 12 / 1080)", height: "calc(100vh * 20 / 1080)", margin: "0 calc(100vh * 53 / 1080) 0 0"}}/>
            </ListModalEventBox>
          ))}
        </ListModalEventContainer>
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
        <DetailModalContent>{selectedEvent?.content}</DetailModalContent> {/* 이벤트 내용 없으면 "내용 없음" 표시*/}
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
          <Title>날짜 선택</Title>
          <Content>일정을 추가할 날짜를 선택해주세요</Content>
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

        <Middle>~</Middle>

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
          <Title>내용 입력</Title>
          <Content>공지할 내용을 입력해주세요</Content>
        </TextBox>

        <NewEventContentInput
          placeholder="내용 입력"
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
        ></NewEventContentInput>

        <ButtonBox>
          <Button backColor="#A7A7A7" onClick={closeCreateModal}>취소</Button>
          <Button backColor={
            formTitle.trim() && 
            startDay.trim() && startMonth.trim() && startYear.trim() &&
            endDay.trim() && endMonth.trim() && endYear.trim() ? "#6D71FF" : "#A7A7A7"
          }
          onClick={handleCreate}
          >등록</Button>
        </ButtonBox>
      </EventModal>

      <EventModal
        isOpen={isEditModalOpen}
        onClose={close}
      >
        <EditTitleInput
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="제목"
        ></EditTitleInput>
        <EditContentArea
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
          placeholder="내용"
        ></EditContentArea>
        <ButtonBox>
          <Button backColor="#A7A7A7" onClick={close}>닫기</Button>
          <Button backColor="#FF7474" onClick={handleDeleteFromEdit}>삭제</Button>
          <Button backColor={formTitle.trim() ? "#6D71FF" : "#A7A7A7"} onClick={handleSaveEdit}>저장</Button>
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
  display: flex;
  flex-direction: column;
  gap: calc(100vh * 19 / 1080);
  margin-top: calc(100vh * 91 / 1080);
`

const ListModalEventBox = styled.div`
  box-sizing: border-box;
  border: 1px solid #939393;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  height: calc(100vh * 100 / 1080);
  width:  calc((100vh * 100 / 1080) * (604 / 100));
  cursor: pointer;
`

const ListModalEventInfoBox = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0 calc(100vh * 36 / 1080);
`

const ListModalEventTItle = styled.span`
  font-size: clamp(15px, 1.04vw, 19px);
  font-weight: 600;
`

const ListModalEventContent = styled.span`
  font-size: clamp(12px, 0.83vw, 15px);
  font-weight: 400;
  color: #939393;
`

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  width:  calc((100vh * 100 / 1080) * (604 / 100));
  position: absolute;
  top: 74.07vh;
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
  font-weight: 600;
  font-size: clamp(30px, 2.08vw, 38px);
  text-align: center;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  display: block;
  box-sizing: border-box;
`

const EditTitleInput = styled.input`
  box-sizing: border-box;
  font-weight: 600;
  font-size: clamp(30px, 2.08vw, 38px);
  border: none;
  outline: none;
  text-align: center; 
  margin: 0;
  padding: 0;
  line-height: 1.5;
  display: block;
`

const DetailModalContent = styled.span`
  box-sizing: border-box;
  font-size: clamp(18px, 1.25vw, 23px);
  font-weight: 600;
  height: calc(100vh * 615 / 1080);
  width:  calc((100vh * 615 / 1080) * (604 / 615));
  margin-top: 5.74vh;
  padding: 0;
  line-height: 1.5;
  display: block;
`

const EditContentArea = styled.textarea`
  box-sizing: border-box;
  font-size: clamp(18px, 1.25vw, 23px);
  font-weight: 600;
  height: calc(100vh * 615 / 1080);
  width:  calc((100vh * 615 / 1080) * (604 / 615));
  resize: none;
  border: none;
  outline: none;
  margin-top: 5.74vh;
  padding: 0;
  line-height: 1.5;
  display: block;
`

const DateInputContainer = styled.div`
  display: flex;
  gap: 32px;
`

const DateInputBox = styled.div`
  display: flex;
  flex-direction: column;
`

const DateLabel = styled.label`
  color: black;
  font-weight: 600;
  font-size: clamp(18px, 1.25vw, 22.8px);
`

const DateInput = styled.input`
  box-sizing: border-box;
  width: calc((100vh * 60 / 1080) * (180 / 60));
  height: calc(100vh * 60 / 1080);
  border-radius: 8px;
  border: 1px solid #939393;
  color: #939393;
  font-weight: 400;
  font-size: clamp(15px, 1.042vw, 19px);
  color: black;
  &::placeholder{
    color: #939393;
  }
  padding: calc(100vh * 16 / 1080);
`

const NewEventTitleInput = styled.input`
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #939393;
  height: calc(100vh * 56 / 1080);
  width:  calc((100vh * 56 / 1080) * (500 / 56));
  font-size: clamp(24px, 1.67vw, 30px);
  font-weight: 600;
  color: black;
  &::placeholder{
    color: #A7A7A7;
  }
  text-align: center;
`

const NewEventContentInput = styled.textarea`
  box-sizing: border-box;
  font-size: clamp(15px, 1.04vw, 19px);
  height: calc(100vh * 254 / 1080);
  width:  calc((100vh * 254 / 1080) * (604 / 254));
  border: 1px solid #939393;
  border-radius: 8px;
  resize: none;
  padding: calc(100vh * 16 / 1080);
`

const Middle = styled.span`
  color: #A7A7A7;
  font-weight: 400;
  font-size: clamp(19.5px, 1.354vw, 24.7px);
  margin: 0.83vh;
`

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin: 1.85vh 0 0.74vh;
`

const Title = styled.span`
  color: black;
  font-weight: 600;
  font-size: clamp(18px, 1.25vw, 22.8px);
`
const Content = styled.span`
  color: #939393;
  font-weight: 400;
  font-size: clamp(15px, 1.042vw, 19px);
`
export default Calendar