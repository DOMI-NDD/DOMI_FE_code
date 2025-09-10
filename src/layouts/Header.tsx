/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Dropdown } from 'react-bootstrap';
import styled from '@emotion/styled'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
        <Head css={css`
          z-index:100;
        `}>
        <LogoText>
          <svg width="170" height="80" viewBox="0 0 182 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.30791 80V0H39.5675C79.6505 0 90.027 42.3581 71.8759 65.4305C63.5781 54.1595 57.4665 49.664 44.1121 44.7682C39.6494 56.9211 40.0393 64.6939 44.1121 79.8043C42.6414 79.9335 41.1265 80 39.5675 80H3.30791Z" fill="black"/>
            <path d="M47.4506 66.4901C53.4912 65.6487 56.3414 64.2225 60.1554 59.426C56.8912 65.1251 54.0422 66.554 47.4506 66.4901Z" fill="black"/>
            <path d="M50.2327 55.011C49.4908 55.011 49.3981 55.9823 50.2327 55.9823C51.0673 55.9823 50.9746 55.011 50.2327 55.011Z" fill="black"/>
            <path d="M90.8555 52V26.5469H99.6445C102.158 26.5469 104.338 27.0566 106.166 28.0762C107.994 29.0957 109.383 30.5547 110.367 32.4531C111.352 34.3691 111.844 36.6367 111.844 39.2383C111.844 41.875 111.352 44.1602 110.367 46.0762C109.383 47.9922 107.959 49.4512 106.113 50.4707C104.25 51.4902 102.053 52 99.5039 52H90.8555ZM99.2578 48.0273C101.912 48.0273 103.916 47.3066 105.252 45.8301C106.588 44.3711 107.273 42.1738 107.273 39.2383C107.273 36.3379 106.605 34.1582 105.287 32.6992C103.951 31.2578 102 30.5195 99.3984 30.5195H95.4258V48.0273H99.2578ZM137.086 46.252C136.066 48.2207 134.678 49.7324 132.92 50.7871C131.162 51.8418 129.158 52.3516 126.926 52.3516C124.676 52.3516 122.672 51.8418 120.914 50.7871C119.156 49.7324 117.768 48.2207 116.766 46.252C115.746 44.2832 115.254 41.9453 115.254 39.2734C115.254 36.6016 115.746 34.2637 116.766 32.2949C117.768 30.3262 119.156 28.832 120.914 27.7773C122.672 26.7227 124.676 26.1953 126.926 26.1953C129.158 26.1953 131.162 26.7227 132.92 27.7773C134.678 28.832 136.066 30.3262 137.086 32.2949C138.088 34.2637 138.598 36.6016 138.598 39.2734C138.598 41.9629 138.088 44.2832 137.086 46.252ZM133.096 34.4219C132.498 33.0859 131.672 32.0664 130.617 31.3633C129.545 30.6602 128.314 30.3086 126.926 30.3086C125.52 30.3086 124.289 30.6602 123.234 31.3633C122.162 32.0664 121.336 33.0859 120.738 34.4219C120.141 35.7578 119.859 37.375 119.859 39.2734C119.859 41.1719 120.141 42.8066 120.738 44.1426C121.336 45.4785 122.162 46.498 123.234 47.2012C124.289 47.9043 125.52 48.2383 126.926 48.2383C128.314 48.2383 129.545 47.9043 130.617 47.2012C131.672 46.498 132.498 45.4785 133.096 44.1426C133.693 42.8066 133.992 41.1719 133.992 39.2734C133.992 37.375 133.693 35.7578 133.096 34.4219ZM148.301 26.5469L155.859 45.0391H156.176L163.734 26.5469H169.359V52H164.965V34.4922H164.719L157.652 51.9297H154.383L147.316 34.4219H147.105V52H142.676V26.5469H148.301ZM178.641 52H174.07V26.5469H178.641V52Z" fill="black"/>
          </svg>
        </LogoText>
        <DropdownWrapper>
        <Dropdown
          // onMouseEnter={() => setShow(true)}
          // onMouseLeave={() => setShow(false)}
          // show={show}
        >
        <Dropdown.Toggle
          variant="success"
          css={css`
            &::after { display: none !important; }
            &:hover,
            &:focus,
            &:active {
              background-color: white !important;
              color: black !important;
              box-shadow: none !important;
            }
            background-color: white !important;     
            color: black !important;                
            border: none !important;   
          `}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_485_533" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
              <rect width="48" height="48" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_485_533)">
              <path d="M6 14V10H42V14H6ZM6 38V34H42V38H6ZM6 26V22H42V26H6Z" fill="#1C1B1F"/>
            </g>
          </svg>


        </Dropdown.Toggle>

        <Dropdown.Menu className='' 
          css={css` 
              width: 340px;
              /* height: 254px;  */
                transform: translateY(23%) !important;
            `}>
          <div style={{ display: 'flex' }}>
            <Img src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.namu.wiki%2Fi%2FKZw2eavDjacb3MoLxJp9xGzkmenTBRFSgluV006RlWyES3-B9rV8Ln8Y_KEJalWaEZ2GqPJxZ2YqxrD7C8BTYA.webp&type=sc960_832" alt="" />
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
              <h2 style={{ margin: '18px 0px 10px 0px', fontWeight: 600 }}>OOO선생님</h2>
              <p css={css`
                  &:hover,
            &:focus,
            &:active {
              background-color: white !important;
              color: black !important;
              box-shadow: none !important;
            }
            background-color: white !important;     
            color: black !important;                
            border: none !important;   
                `}>
                <Button variant="primary" onClick={()=>{
                  handleShow();
                  navigate('/')
                }} css={
                    css`
                      color: red;
                      font-size: 22px;
                      margin: 2px 1px 0px;
                      padding: 0;
                      &:hover,
                      &:focus,
                      &:active {
                        background-color: white !important;
                        color: red !important;
                        box-shadow: none !important;
                      }
                      background-color: white !important;     
                      color: red !important;                
                      border: none !important; 
                    `}
                  >
                    
                      로그아웃
                  </Button>
                      <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>로그아웃</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>정말 로그아웃 하시겠습니까?</Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            취소
                          </Button>
                          <Button css={css`
                            &:hover,
                            &:focus,
                            &:active {
                              background-color: #FF0000 !important;
                              border: 0 !important;
                            }
                            background-color: #FF0000;
                            border: 0;
                          `} variant="primary" onClick={()=>{
                            handleClose()
                            localStorage.removeItem("accessToken")
                            window.dispatchEvent(new Event("storage"));
                            // navigate('/')
                          }}>
                            로그아웃
                          </Button>
                        </Modal.Footer>
                      </Modal>
                </p>
            </div>
          </div>
          <DropdownItem href="#/action-2">
            <P>홈</P>
            </DropdownItem>
          <DropdownItem href="/dashboard">
            <P>게시판</P>
          </DropdownItem>
        </Dropdown.Menu>
        </Dropdown>
        </DropdownWrapper>
      </Head>
  )
}

const Head = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 20px 20px 20px;
  background-color: white;
  border-bottom: 2px solid rgba(167, 167, 167, 1);
  position: relative;
`;

const LogoText = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const DropdownWrapper = styled.div`
  margin-left: auto;
`;

const Img = styled.img`
  width: 100px;
  height: 100px;
  margin: 10px 10px 16px 20px;
`

const DropdownItem = styled(Dropdown.Item)`
  width: 92.3%;
  height: 40px;
  margin: 3px 13px;
  font-size: 20px;
  border-radius: 9px !important;
  font-size: 20px !important;
  display: table;
  padding-top: 0 10px;
  &:hover { 
    font-weight: 600;
    background-color: rgba(109, 113, 255, 1) !important; 
    color: rgba(255, 255, 255, 1) !important;
  }
`

const P = styled.p`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  margin-bottom: 0;
`