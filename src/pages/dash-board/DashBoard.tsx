/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled'
import WriteCompo from '@/pages/dash-board/components/writeCompo';


interface ItemType {
  id: number;
  name: string;
  contents: string;
}

export default function DashBoard() {
  return(
    <Div>
      <WriteCompo />
    </Div>
  )
}

const Div = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items: center;
`

