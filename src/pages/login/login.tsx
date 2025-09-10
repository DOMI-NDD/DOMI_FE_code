/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Logo from "@/layouts/Logo";
import { Id, Password, Button } from './LoginCompnent';
import { useState } from 'react';

type LoginProps = {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Login({ setToken }: LoginProps) {
  let [id, setId] = useState("")
  let [pass, setPass] =useState("")
  return (
    <div
      css={css`
        display: flex;
        width: 100vw;
        height: 100vh;
        background-color: rgba(109, 113, 255, 1);
      `}
    >
      {/* 왼쪽 영역 */}
      <div
        css={css`
          /* width: 100px;
          height: 100px; */
          flex: 47;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `}
      >
        <Logo fill="rgba(255, 255, 255, 1)" width={160} height={160}/>
        <h2 
          css={css`
            font-weight: 800;
            color: white;
            margin-top: 50px;
          `}
        >도미와 함께 학교의 실시간 정보를 확인하세요!</h2>
      </div>

      {/* 오른쪽 영역 */}
      <div
        css={css`
          flex: 53;
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-bottom-left-radius: 100px;
          border-top-left-radius: 100px;
        `}
      >
        <Logo fill="#000000" width={80} height={80}/>
        <p 
          css={css`
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 70px;
          `}
        >로그인하고 DOMI를 사용해보세요</p>
        <form
          css={css`
            display :flex;
            flex-direction: column;
          `}
        >
          <Id id={id} setId={setId} />
          <Password pass={pass} setPass={setPass}/>
          <Button id={id} pass={pass} setToken={setToken} />
        </form>
      </div>
    </div>
  );
}
