/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import URL from '@/layouts/Url';

type IdProps = {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
};

type PassProps = {
  pass: string;
  setPass: React.Dispatch<React.SetStateAction<string>>;
};

type BtnProps = {
  id: string;
  pass: string;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export function Id({ id, setId }: IdProps) {
  return (
    <>
      <Div>
        <P>아이디</P>
      </Div>
      <Input
        type="text"
        placeholder="아이디 입력"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      />
    </>
  );
}

export function Password({ pass, setPass }: PassProps) {
  return (
    <>
      <Div>
        <P>비밀번호</P>
      </Div>
      <Input 
        type="password" 
        placeholder="비밀번호 입력"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        required
      />
    </>
  )
}

export function Button({ id, pass, setToken }: BtnProps) {
  let navigate = useNavigate()
  const handleSubmit = async () => {

    // 유효성 검사
    if (!id.trim() || !pass.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${URL}/auths/sign-in`, {
        accountId: id,
        password: pass,
      });
      const username = response.data.username
      const accountId = response.data.accountId
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      localStorage.setItem("username", username);
      localStorage.setItem("accountId", accountId); 
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      navigate('/');
      
    } catch (error) {
      console.error('로그인 실패:', error);
      alert("로그인에 실패했습니다.");
    }
  };
  return(
    <>
      <Btn type='submit'  onClick={(e)=>{
        e.preventDefault();
        handleSubmit()
      }}>
        <P
          css={css`
            color: white;
            text-align:center;
            margin:0;
          `}
        >로그인</P>
      </Btn>
    </>
  )
}

const P = styled.p `
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 5px 6px;
  text-align: start;
`

const Input = styled.input`
  border: 2px solid rgba(167, 167, 167, 1);
  border-radius: 8px;
  width: 520px;
  height: 58px;
  padding: 20px 17px;
  margin-bottom: 25px;
  &::placeholder {
    color: rgba(167, 167, 167, 1);
  }
  &:focus {
    border: 2px solid rgba(69, 76, 255, 1);
    outline: none;
  }
`

const Div = styled.div`
  width: 510px;
  /* height: 68px; */
  text-align: start;
  margin:0;
  padding:0;
`

const Btn = styled.button`
  width: 520px;
  height: 76px;
  background-color: rgba(109, 113, 255, 1);
  border: 0;
  border-radius: 8px;
  margin-top: 100px
`