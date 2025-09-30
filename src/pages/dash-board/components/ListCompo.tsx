/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled'
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
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  selectedItem: ItemType | null
  setSelectedItem:React.Dispatch<React.SetStateAction<ItemType | null>>;
  onSuccess: () => void;
}

export default function AddList({ add, setAdd, show, setShow, selectedItem, setSelectedItem, onSuccess }: ListProps) {
  const [editMode, setEditMode] = useState(false);

  const handleClose = () => {
    setSelectedItem(null);
    setShow(false);
  };

  const handleSubmit = async (id: any) => {
    console.log(id)
    const accessToken = localStorage.getItem("accessToken")
    try {
      const response = await axios.delete(`${URL}/notice-boards/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
      });
      onSuccess()
      console.log(response)
    } catch (error) {
      console.error('연결 실패:', error);
      alert("연결에 실패했습니다.");
    }
  };

  return (
    <>
      <DetailModal show={show} onHide={handleClose} dialogClassName="modal-80size" >
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body css={css`
          margin:15px;
          background-color: #dadfe8;
        `}>{selectedItem?.detail}</Modal.Body>
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
              if(!selectedItem) return;
              handleSubmit(selectedItem.id)
              handleClose()
          }}>
            삭제
          </Button>
        </Modal.Footer>
      </DetailModal>

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

const Btn = styled(Button)`
  background-color: white;
  border:0;
  color:black;
  display: flex;
  align-items: center;
  &:hover, &:focus, &:active {
    background-color: white !important;
    color: black !important;
    box-shadow: none !important;
  }
`

const Table = styled.table`
  width:80%;
  margin-top:30px;
  padding:0 20px;
  border:0;
  border-collapse: collapse;
`

const TableHead = styled.thead`
  /* background-color: #f0f0f0;  */
  text-align: left;
  color: #666;
  padding:20px;
  border:0;
  font-size:28px;
`;

const TableBody = styled.tbody`
  color: #333;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(147, 147, 147, 1);
  padding:20px;
`;

const TableHeadCell = styled.td`
  padding: 0 12px;
  height:64px;
  font-size: 28px;
  color:rgba(0, 0, 0, 1);
`

const TableCellDiv = styled.div`
  display:flex;
  justify-content:center;
`

const TableCell = styled.td`
  padding: 0 18px;
  height:64px;
  font-size: 20px;
`;

const Span = styled.span`
  font-size: 28px;
`



const DetailModal = styled(Modal)`
  .modal-dialog.modal-80size {
    max-width: 50%;
    margin: 1.75rem auto;
  }
  .modal-content {
    min-height: 400px;
  }
`