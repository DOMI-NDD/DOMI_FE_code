/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EditCompo from '@/pages/dash-board/components/EditCompo';
import type { ItemType } from '@/types';
import URL from '@/layouts/Url';

interface ListProps {
  add: ItemType[];
  setAdd: React.Dispatch<React.SetStateAction<ItemType[]>>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: ItemType | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<ItemType | null>>;
  onSuccess: () => void;
}

export default function AddList({
  add,
  setAdd,
  show,
  setShow,
  selectedItem,
  setSelectedItem,
  onSuccess,
}: ListProps) {
  const [editMode, setEditMode] = useState(false);
  const [rmShow, setRmShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const rmHandleClose = () => setRmShow(false);
  const rmHandleShow = () => setRmShow(true);

  const handleSubmit = async (id: any) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${URL}/notice-boards/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      onSuccess();
    } catch (error) {
      console.error('연결 실패:', error);
      alert('연결에 실패했습니다.');
    }
  };

  return (
    <>
      {/* 상세보기 모달 */}
      <DetailModal show={show} onHide={handleClose} dialogClassName="modal-80size">
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          css={css`
            margin: 15px;
            background-color: #dadfe8;
          `}
        >
          {selectedItem?.detail}
        </Modal.Body>
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
            css={css`
              &:hover,
              &:focus,
              &:active {
                background-color: #ff0000 !important;
                border: 0 !important;
              }
              background-color: #ff0000;
              border: 0;
            `}
            variant="primary"
            onClick={() => {
              handleClose();
              rmHandleShow();
            }}
          >
            삭제
          </Button>
        </Modal.Footer>
      </DetailModal>
      <Modal show={rmShow} onHide={rmHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말 삭제 하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={rmHandleClose}>
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
            if(!selectedItem) return;
            console.log('?')
            handleSubmit(selectedItem.id)
            setSelectedItem(null);
            rmHandleClose()
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
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}

const DetailModal = styled(Modal)`
  .modal-dialog.modal-80size {
    max-width: 50%;
    margin: 1.75rem auto;
  }
  .modal-content {
    min-height: 400px;
  }
`;
