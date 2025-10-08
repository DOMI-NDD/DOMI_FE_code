/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import type { ItemType } from '@/types';
import URL from '@/layouts/Url';

interface EditProps {
  selectedItem: ItemType;
  add: ItemType[];
  setAdd: React.Dispatch<React.SetStateAction<ItemType[]>>;
  onClose: () => void;
  onSuccess: () => void
}

export default function EditCompo({ selectedItem, onClose, onSuccess }: EditProps) {
  const [title, setTitle] = useState(selectedItem.title);
  const [content, setContent] = useState(selectedItem.detail);

  const handleSubmit = async (id: Number) => {
    try {
      console.log(id)
      console.log(`${URL}/notice-boards/${id}`)
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.put(`${URL}/notice-boards/${id}`, 
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
      onSuccess()
      console.log(response)
    } catch (error) {
      console.error('연결 실패:', error);
      alert("연결에 실패했습니다.");
    }
  };

  return (
    <Modal show={true} onHide={onClose} dialogClassName="modal-80size"
      css={css`
        .modal-dialog.modal-80size {
          max-width: 50%;
          margin: 1.75rem auto;
        }
        .modal-content {
          min-height: 400px;
        }
      `}
    >
      <Modal.Header closeButton>
        <Modal.Title>공지 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>제목</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            css={css`margin-bottom:10px;`}
          />
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            css={css`resize: none;`}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (title.trim() === "") return alert("제목을 입력하세요");
            if(!selectedItem) return;
            handleSubmit(selectedItem.id)
            onClose();
          }}
        >
          글 수정
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
