/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import type { ItemType } from '@/types';
import URL from '@/layouts/Url';

interface WriteProps {
  add: ItemType[];
  setAdd: React.Dispatch<React.SetStateAction<ItemType[]>>;
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  onSuccess: () => void;
}

export default function Write({ add, show, setShow, onSuccess } : WriteProps) {

  const handleClose = () => setShow(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.post(`${URL}/notice-boards`, 
        {
          title: title,
          detail: content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      console.log(response.data)
      onSuccess();

    } catch (error) {
      console.error('연결 실패:', error);
      alert("연결에 실패했습니다.");
      
    }
  };

  return(
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-80size" centered
      css={css`
        .modal-dialog.modal-80size {
          max-width: 50%;
          margin: 1.75rem auto;
        }

        .modal-content {
          min-height: 400px;
        }
      `}>
        <Modal.Header closeButton>
          <Modal.Title>공지 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body css={css`
          padding-bottom:0;
        `}>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>제목</Form.Label>
            <Form.Control autoFocus type='text' css={css`
              margin-bottom:10px;
            `}
            value={title}
            onChange={(e)=>{setTitle(e.target.value)}}
            />

            <Form.Label>내용</Form.Label>
            <Form.Control as='textarea' rows={15} css={css`
              resize: none;
            `} 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />
            
          </Form.Group>
        </Modal.Body>
        <Modal.Footer css={css`
          border:0;
        `}>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={() => {
            if(title.trim() === "" || content.trim() === "") alert('제목과 내용을 입력하세요')
            else {
            handleSubmit()
            setTitle('');
            setContent('');
            // setAdd([newItem, ...add]); //이게 내가 전체 배열에 직접 반영하는 거임
            handleClose();
            console.log(add)
          }}}>
            글 추가
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}