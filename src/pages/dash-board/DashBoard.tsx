/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Write from '@/pages/dash-board/components/writeCompo';
import Button from 'react-bootstrap/Button';
import AddList from '@/pages/dash-board/components/ListCompo';
import type { ItemType } from '@/types';
import ReactPaginate from "react-paginate";
import SearchBar from '@/pages/dash-board/components/SearchCompo';
import URL from '@/layouts/Url';
import { useNavigate, useSearchParams } from "react-router-dom";


export default function DashBoard() {
  const [add, setAdd] = useState<ItemType[]>([]); 
  const [search, setSearch] = useState<string>("")
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  
  const fetchData = async () => {
    try {
      console.log(search)
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("토큰이 없습니다. 로그인 필요");
        navigate('/login')
        return;
      }
      const keyword = searchParams.get("keyword") || "";
      const response = await axios.get(`${URL}/notice-boards`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { keyword }
      });
      setAdd(response.data);
    } catch (error) {
      console.error("오류:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("로그인이 필요합니다.");
          navigate('/login');
        } else if (error.response?.status === 400) {
          alert("잘못된 요청입니다.");
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);


  const [WriteShow, setWriteShow] = useState(false);
  
  const handleWriteShow = () => setWriteShow(true);

  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [DetailShow, setDetailShow] = useState(false);

  const handleDetailShow = (item: ItemType) => {
    setSelectedItem(item);
    setDetailShow(true);
  };

  const [page, setPage] = useState(0);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(add.length/itemsPerPage)
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedItems = add.slice(startIndex, endIndex);
  
  const handlePageClick = (data: { selected: number }) => {
    setPage(data.selected);
  };

  return(
    <Div>
      <SearchBar search={search} setSearch={setSearch} onSuccess={fetchData} searchParams={searchParams} setSearchParams={setSearchParams} />
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell width="65%" css={css`
              border-right: 1px solid rgba(147, 147, 147, 1);
            `}><TableCellDiv>제목</TableCellDiv></TableHeadCell>
            <TableHeadCell width="20%"><TableCellDiv>작성자</TableCellDiv></TableHeadCell>
            <TableHeadCell width="15%"><TableCellDiv>작성일</TableCellDiv></TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedItems.map((a, i) => {
            const d = new Date(a.createdAt)
            const date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
            return(
              <TableRow key={i}>
                <TableCell>
                  <Btn
                    variant="primary"
                    onClick={() => handleDetailShow(a)}
                  >
                    <Span>
                      <b>{a.title}</b>
                    </Span>
                  </Btn>
                </TableCell>
                <TableCell css={css`
                  font-size:28px;
                  font-weight:600;
                `}><TableCellDiv>{a.writer}</TableCellDiv></TableCell>
                <TableCell css={css`
                  font-size:24px;
                  color:rgba(147, 147, 147, 1);
                `}><TableCellDiv>{date}</TableCellDiv></TableCell>
              </TableRow>
            )})}
        </TableBody>
        <AddList 
          add={add} 
          setAdd={setAdd} 
          show={DetailShow} 
          setShow={setDetailShow} 
          selectedItem={selectedItem} 
          setSelectedItem={setSelectedItem}
          onSuccess={fetchData}
        />
      </Table>
      <PaginationContainer>
        <EndBtn onClick={() => setPage(0)}>≪</EndBtn>
        <ReactPaginate
          pageCount={totalPages}            // 총 페이지 수
          forcePage={page}
          pageRangeDisplayed={4}    // 표시할 페이지 번호
          marginPagesDisplayed={0}  // 앞뒤 표시 페이지 수
          onPageChange={handlePageClick}
          breakLabel={null}
          previousLabel={"<"}
          nextLabel={">"}
          activeClassName={"active"}
        />
        <EndBtn onClick={() => setPage(totalPages - 1)}>≫</EndBtn>
      </PaginationContainer>
      <AddButton variant="primary" onClick={handleWriteShow}>
        글 추가
      </AddButton>
      <Write add={add} setAdd={setAdd} show={WriteShow} setShow={setWriteShow} onSuccess={fetchData} />

    </Div>
  )
}

const Div = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items: center;
  margin:30px 200px;
`

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

const AddButton = styled(Button)`
  width:200px;
  height:100px;
  border-radius:60px;
  color:white;
  background-color:rgba(109, 113, 255, 1);
  font-size:28px;
  font-weight:600;
  position:fixed;
  right: 3%;
  bottom: 5%;
`

const EndBtn = styled.div`
  display:flex;
  align-items:center;
  height:40px;
  border: 1px solid #ccc;
  padding: 20px 11px;
  cursor: pointer;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 8px;
  padding: 0;

  ul {
    display: flex;
    list-style: none;
    gap: 6px;
    padding: 0;
  }

  li {
    border: 1px solid #ccc;

    a {
      display: block;          /* inline → block */
      padding: 8px 12px;       /* 클릭 영역 확장 */
      text-align: center;
      cursor: pointer;
      color: inherit;
      text-decoration: none;
    }

    &.active {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }

    &.break {
      border: none;          /* ... 버튼 테두리 제거 */
      cursor: default;       /* 클릭 커서 제거 */
      background: none;      /* 배경 제거 */
    }
  }
`;