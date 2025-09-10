/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

interface ItemType {
  id: number;
  name: string;
  contents: string;
}

interface EditProps {
  selectedItem: ItemType;
  add: ItemType[];
  setAdd: React.Dispatch<React.SetStateAction<ItemType[]>>;
  onClose: () => void;
}

export default function EditCompo({ selectedItem, add, setAdd, onClose }: EditProps) {
  const [title, setTitle] = useState(selectedItem.name);
  const [content, setContent] = useState(selectedItem.contents);

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

            const updated = add.map((item) =>
              item.id === selectedItem.id
                ? { 
                    ...item, 
                    name: title, 
                    contents: content 
                  } // 이걸 post로 백엔드에 넘겨줌
                : item
            );
            setAdd(updated);
            onClose();
          }}
        >
          글 수정
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
