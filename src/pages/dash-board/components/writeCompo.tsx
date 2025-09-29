/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import AddList from '@/pages/dash-board/components/AddListCompo';

interface ItemType {
  id: number;
  name: string;
  contents: string;
}

export default function WriteCompo() {
  const [add, setAdd] = useState<ItemType[]>([]); 

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return(
    <>
      <div css={css`
        width: 1000px;
        height: 64px;
        background-color: gray;
        margin-top: 50px;
      `}>검색창</div>

      <div> 
        
        <AddList add={add} setAdd={setAdd} />
      </div>
      <Button variant="primary" onClick={handleShow}>
        공지사항
      </Button>

      <Modal show={show} onHide={handleClose} dialogClassName="modal-80size"
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
        <Modal.Body>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="primary" onClick={() => {
            if(title.trim() === "") alert('제목을 입력하세요')
            else {
            const newItem: ItemType = {
              id: add.length + 1,
              name: title,
              contents: content,
            }; // 이걸 post로 백엔드에 넘겨줌
            setTitle('');
            setContent('');
            setAdd([newItem, ...add]);
            handleClose();
          }}}>
            글 추가
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}