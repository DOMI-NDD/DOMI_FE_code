import React, { useEffect, useRef } from "react";
import styled from '@emotion/styled';

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const EventModal: React.FC<EventModalProps> = ({isOpen, onClose, title = "Modal", children}) => {
  const backdropRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if(!isOpen){
  //     return;
  //   }
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if(e.key === "Escape"){
  //       onClose();
  //     };
  //   }
  //   window.addEventListener("keydown", onKeyDown);
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, [isOpen, onClose]);
  
  if(!isOpen){ //isOpen이 false일 경우 return 못하게 걸러줌
    return null;
  }
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if(e.target === backdropRef.current){
      onClose();
    }
  }
  return (
    <ModalWrapper onClick={handleBackdropClick} ref={backdropRef}>
      <Card>
        <Body>{children}</Body>
      </Card>
    </ModalWrapper>
  )
}

const ModalWrapper  = styled.div`
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`

const Card = styled.div` // 공통 모달 틀
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: calc(100vh * 900 / 1080);
  width: calc((100vh * 900 / 1080) * (800/900));
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px 20px;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default EventModal