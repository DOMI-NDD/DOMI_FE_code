import styled from '@emotion/styled'
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import { type SetURLSearchParams } from 'react-router-dom';

interface SearchBar {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  onSuccess: () => void
}

export default function SearchBar({ search, setSearch, onSuccess, searchParams, setSearchParams }: SearchBar) {
  


  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) setSearch(keyword);
  }, [searchParams]);

  const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      if(search==="") return alert("검색어를 입력하세요")
      setSearchParams({keyword: search})
      onSuccess();
    }
  }

  return(
    <SearchBox>
      <Input 
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
        }}
        onKeyDown={activeEnter}
      />
      <Div>
        <P onClick={()=>{
          if(search==="") return alert("검색어를 입력하세요")
          setSearchParams({keyword: search})
          onSuccess()
        }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </P>
        <P onClick={()=>{
          searchParams.delete('keyword')
          setSearchParams(searchParams)
          setSearch('')
        }}>
          <Reset
            icon={faRotateLeft}
              // rotated={rotated}  
              // onClick={() => setRotated(!rotated)}
          />
        </P>
      </Div>
    </SearchBox>
  )
}

const SearchBox = styled.div`
  width: 1000px;
  height: 64px;
  /* background-color: #d3d3d3; */
  border: 2px solid #acacac;
  border-radius: 20px;
  padding: 5px 18px;
  margin-top: 50px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  &:hover {
    border: 2px solid gray !important;
  }
`

const Input = styled.input`
  width:90%;
  height:100%;
  border: 0;
  font-size: 23px;
  &:focus {
    outline:none;
  }
`

const Div = styled.div`
  width: 30px;
  height:30px;
  cursor: pointer;
  display:flex;
  justify-content:center;
  align-items:center;
`

const P = styled.p`
  color: rgba(69, 76, 255, 1);
  font-size:22px;
  margin: 0;
  /* padding-right: 15px; */
  translate:all 1s ease-in;
`

const Reset = styled(FontAwesomeIcon)`
  color: rgba(69, 76, 255, 1);
  font-size: 22px;
  margin: 0;
  cursor: pointer;  
`;
