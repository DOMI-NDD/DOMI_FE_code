/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled'
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EditCompo from '@/pages/dash-board/components/EditCompo';

interface ItemType {
  id: number;
  name: string;
  contents: string;
}

interface AddListProps {
  add: ItemType[];
  setAdd: React.Dispatch<React.SetStateAction<ItemType[]>>;
}

export default function AddList({ add, setAdd }: AddListProps) {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

  const handleClose = () => {
    setSelectedItem(null);
    setShow(false);
  };
  const handleShow = (item: ItemType) => {
    setSelectedItem(item);
    setShow(true);
  };

  return (
    <div>
      {add.map((a, i) => (
        <div key={i}>
          <Button
            variant="primary"
            onClick={() => handleShow(a)}
            css={css`
              background-color: #dfe4ef;
              color:black;
              width: 800px;
              height: 80px;
              display: flex;
              align-items: center;
              padding-left: 30px;
              margin: 30px;
            `}
          >
            <h3>
              <b>{a.name}</b>
            </h3>
          </Button>
        </div>
      ))}

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
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body css={css`
          margin:15px;
          background-color: #dadfe8;
        `}>{selectedItem?.contents}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShow(false);
              setEditMode(true);
            }}
          >
            수정
          </Button>
          <Button
            css={css`background-color:red;`}
            variant="primary"
            onClick={()=>{
              const updated = add.filter((e) => e.id !== selectedItem?.id);
              setAdd(updated);
              handleClose()
          }}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

      {editMode && selectedItem && (
        <EditCompo
          selectedItem={selectedItem}
          add={add}
          setAdd={setAdd}
          onClose={() => setEditMode(false)}
        />
      )}
    </div>
  );
}
